-- Migration 015: Add welcome email trigger for new user registrations
-- This trigger calls the welcome email API endpoint when a new profile is created

-- Create function to send welcome email via HTTP request
CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
  api_url TEXT;
BEGIN
  -- Get user email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.id;

  -- Get user's first name
  user_name := SPLIT_PART(NEW.full_name, ' ', 1);

  -- Construct API URL (use environment variable in production)
  api_url := current_setting('app.settings.base_url', true) || '/api/auth/send-welcome';

  -- Send HTTP POST request to welcome email API
  -- Note: This requires the http extension to be enabled in Supabase
  -- If http extension is not available, you can use Edge Functions instead
  PERFORM net.http_post(
    url := api_url,
    body := json_build_object(
      'email', user_email,
      'firstName', user_name
    )::text,
    headers := json_build_object(
      'Content-Type', 'application/json'
    )::jsonb
  );

  RAISE NOTICE 'Welcome email triggered for user: % (%)', user_name, user_email;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the profile creation
  RAISE WARNING 'Failed to send welcome email for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after new profile is inserted
DROP TRIGGER IF EXISTS on_profile_created_send_welcome ON profiles;
CREATE TRIGGER on_profile_created_send_welcome
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_email();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION send_welcome_email() TO authenticated;
GRANT EXECUTE ON FUNCTION send_welcome_email() TO service_role;

-- Add comment
COMMENT ON FUNCTION send_welcome_email() IS 'Automatically sends welcome email when a new user profile is created';
COMMENT ON TRIGGER on_profile_created_send_welcome ON profiles IS 'Triggers welcome email on new user registration';
