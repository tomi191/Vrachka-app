-- Function: get_schema_overview
-- Returns a JSONB summary of public tables, columns, and RLS policies

create or replace function public.get_schema_overview()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'tables', (
      select jsonb_agg(
        jsonb_build_object(
          'table', t.table_name,
          'columns', (
            select jsonb_agg(
              jsonb_build_object(
                'name', c.column_name,
                'type', c.data_type
              )
              order by c.ordinal_position
            )
            from information_schema.columns c
            where c.table_schema = 'public'
              and c.table_name = t.table_name
          )
        )
        order by t.table_name
      )
      from information_schema.tables t
      where t.table_schema = 'public' and t.table_type = 'BASE TABLE'
    ),
    'policies', (
      select coalesce(jsonb_agg(
        jsonb_build_object(
          'table', pol.tablename,
          'policy', pol.policyname,
          'command', pol.cmd,
          'permissive', pol.permissive,
          'roles', pol.roles,
          'qual', pol.qual,
          'with_check', pol.with_check
        )
        order by pol.tablename, pol.policyname
      ), '[]'::jsonb)
      from pg_policies pol
      where pol.schemaname = 'public'
    )
  ) into result;

  return result;
end;
$$;

-- Restrict execution to service role only (API route will enforce admin)
revoke all on function public.get_schema_overview() from public;
grant execute on function public.get_schema_overview() to service_role;

