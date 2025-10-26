-- Create synastry_reports table for storing compatibility analyses
CREATE TABLE IF NOT EXISTS synastry_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  person1_natal_chart_id UUID NOT NULL REFERENCES natal_charts(id) ON DELETE CASCADE,
  person2_name TEXT NOT NULL,
  person2_birth_data JSONB NOT NULL,
  person2_chart_data JSONB NOT NULL,
  synastry_data JSONB NOT NULL,
  interpretation JSONB,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_synastry_reports_user_id ON synastry_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_synastry_reports_person1_chart ON synastry_reports(person1_natal_chart_id);
CREATE INDEX IF NOT EXISTS idx_synastry_reports_generated_at ON synastry_reports(generated_at DESC);

-- Enable Row Level Security
ALTER TABLE synastry_reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own synastry reports"
  ON synastry_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own synastry reports"
  ON synastry_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own synastry reports"
  ON synastry_reports FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own synastry reports"
  ON synastry_reports FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_synastry_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER synastry_reports_updated_at
  BEFORE UPDATE ON synastry_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_synastry_reports_updated_at();

-- Add comment
COMMENT ON TABLE synastry_reports IS 'Stores synastry (compatibility) reports between two natal charts';
