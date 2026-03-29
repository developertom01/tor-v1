-- Enable pg_cron extension (available on all Supabase plans)
-- Must be in its own migration file before any cron.schedule() calls

RESET ALL;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;
