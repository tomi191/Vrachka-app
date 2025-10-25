-- DB-backed rate limiting storage and RPC
create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 0,
  window_end_at timestamptz not null default now()
);

-- Helpful index for scanning by window_end_at if needed
create index if not exists rate_limits_window_end_at_idx on public.rate_limits (window_end_at);

-- RPC: increments counter and returns allowed/remaining/reset_at
create or replace function public.rate_limit_increment(
  p_key text,
  p_window_seconds integer,
  p_max_requests integer
)
returns table (
  allowed boolean,
  remaining integer,
  reset_at timestamptz
)
language plpgsql
as $$
declare
  v_now timestamptz := now();
  v_count integer;
  v_reset_at timestamptz;
  v_existing record;
begin
  -- Try to lock existing row
  select key, count, window_end_at into v_existing
  from public.rate_limits
  where key = p_key
  for update;

  if not found or v_existing.window_end_at <= v_now then
    v_reset_at := v_now + make_interval(secs => p_window_seconds);
    insert into public.rate_limits as rl (key, count, window_end_at)
    values (p_key, 1, v_reset_at)
    on conflict (key)
    do update set count = 1, window_end_at = excluded.window_end_at
    returning count, window_end_at into v_count, v_reset_at;

    return query select true::boolean, greatest(p_max_requests - 1, 0), v_reset_at;
  else
    update public.rate_limits
    set count = v_existing.count + 1
    where key = p_key
    returning count, window_end_at into v_count, v_reset_at;

    return query select (v_count <= p_max_requests)::boolean, greatest(p_max_requests - v_count, 0), v_reset_at;
  end if;
end;
$$;

-- Ensure auth: restrict to service role (RLS bypass) or add appropriate policies if needed
-- By default, expose as RPC; callers should use service key
alter function public.rate_limit_increment(text, integer, integer) owner to postgres;

