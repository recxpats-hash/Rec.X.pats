-- =========================================================================
-- SUPABASE DATABASE SETUP SCRIPT FOR RECXPATS AQUACULTURE OPERATIONS
-- Run this script inside your Supabase project's SQL Editor (https://supabase.com)
-- =========================================================================

-- 1. Create the core 'recxpats_records' table for multi-model syncing
CREATE TABLE IF NOT EXISTS recxpats_records (
  id TEXT NOT NULL,
  model TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id, model)
);

-- If table already exists with 'id' as primary key, upgrade it to (id, model)
ALTER TABLE recxpats_records DROP CONSTRAINT IF EXISTS recxpats_records_pkey;
ALTER TABLE recxpats_records ADD PRIMARY KEY (id, model);

-- 2. Configure permissions and security for the table
-- Disable Row Level Security (RLS) to allow direct dynamic reads & writes
ALTER TABLE recxpats_records DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anonymous, authenticated, and service_role client connections
GRANT ALL ON TABLE recxpats_records TO anon;
GRANT ALL ON TABLE recxpats_records TO authenticated;
GRANT ALL ON TABLE recxpats_records TO service_role;

-- 3. Create helper function for programmatic Auth User seeding (Optional but recommended)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION create_supabase_user(
  user_email TEXT,
  user_password TEXT,
  full_name TEXT,
  user_role TEXT
) RETURNS VOID AS $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  encrypted_pass TEXT;
BEGIN
  -- Verify if user already exists to prevent duplicate key violations
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
    encrypted_pass := crypt(user_password, gen_salt('bf', 10));

    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud
    ) VALUES (
      new_user_id, '00000000-0000-0000-0000-000000000000',
      user_email, encrypted_pass,
      NOW(), NOW(), NOW(),
      jsonb_build_object('provider', 'email', 'providers', array_to_json(array['email'])),
      jsonb_build_object('full_name', full_name, 'user_role', user_role),
      FALSE, 'authenticated', 'authenticated'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. Seed default system users with pre-configured roles
SELECT create_supabase_user('inno@executive.com', 'executive123', 'Innocent Director', 'Executive');
SELECT create_supabase_user('lau@customer.com', 'customer123', 'Ken Lawrence', 'Customer');
SELECT create_supabase_user('ajabi@admin.com', 'admin123', 'Lawrence Ajabi', 'Admin');
SELECT create_supabase_user('restricted-trial@customer.com', 'trial123', 'Trial User', 'Customer');
SELECT create_supabase_user('recxpats@gmail.com', 'Admin@recxpats', 'Recxpats Admin', 'Admin');
SELECT create_supabase_user('lau@finance.com', 'finance123', 'Lau Finance', 'Finance');
SELECT create_supabase_user('ivan@marketer.com', 'marketer123', 'Ivan Marketer', 'Marketer');

-- =========================================================================
-- Setup Complete! Click 'Recheck Supabase' in the app to begin synchronization.
-- =========================================================================
