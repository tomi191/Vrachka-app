-- Create personal_horoscopes table for storing personalized transit forecasts
CREATE TABLE IF NOT EXISTS personal_horoscopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  natal_chart_id UUID NOT NULL REFERENCES natal_charts(id) ON DELETE CASCADE,
  forecast_type TEXT NOT NULL CHECK (forecast_type IN ('monthly', 'yearly')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  transits_data JSONB NOT NULL,
  current_planets JSONB NOT NULL,
  themes JSONB NOT NULL,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  challenges TEXT[] NOT NULL DEFAULT '{}',
  opportunities TEXT[] NOT NULL DEFAULT '{}',
  interpretation JSONB,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_personal_horoscopes_user_id ON personal_horoscopes(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_horoscopes_natal_chart ON personal_horoscopes(natal_chart_id);
CREATE INDEX IF NOT EXISTS idx_personal_horoscopes_type ON personal_horoscopes(forecast_type);
CREATE INDEX IF NOT EXISTS idx_personal_horoscopes_generated_at ON personal_horoscopes(generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_personal_horoscopes_date_range ON personal_horoscopes(start_date, end_date);

-- Enable Row Level Security
ALTER TABLE personal_horoscopes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own personal horoscopes"
  ON personal_horoscopes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own personal horoscopes"
  ON personal_horoscopes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personal horoscopes"
  ON personal_horoscopes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personal horoscopes"
  ON personal_horoscopes FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_personal_horoscopes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER personal_horoscopes_updated_at
  BEFORE UPDATE ON personal_horoscopes
  FOR EACH ROW
  EXECUTE FUNCTION update_personal_horoscopes_updated_at();

-- Add comment
COMMENT ON TABLE personal_horoscopes IS 'Stores personalized horoscope forecasts based on natal charts and current transits';
