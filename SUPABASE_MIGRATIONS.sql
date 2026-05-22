-- Supabase Database Migrations for Enhanced Security and Session Management
-- This script implements the security improvements for POS DESTINY System
-- Run these migrations in your Supabase SQL editor

-- ============================================================================
-- 1. ADD SESSION TRACKING TABLE
-- ============================================================================
-- This table tracks active user sessions for enhanced security and audit trails

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  login_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  logout_timestamp TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);

-- ============================================================================
-- 2. ADD INACTIVITY LOG TABLE
-- ============================================================================
-- Track inactivity warnings and automatic logouts for security auditing

CREATE TABLE IF NOT EXISTS inactivity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL, -- 'warning_shown', 'logout', 'activity_detected'
  inactivity_duration_minutes INTEGER,
  warned_at TIMESTAMP WITH TIME ZONE,
  logged_out_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_inactivity_logs_user_id ON inactivity_logs(user_id);
CREATE INDEX idx_inactivity_logs_event ON inactivity_logs(event_type);

-- ============================================================================
-- 3. ENHANCE USERS TABLE WITH SESSION MANAGEMENT
-- ============================================================================
-- Add columns to track last login and inactivity timeout settings

-- Add last_login_at column if not exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS inactivity_timeout_minutes INTEGER DEFAULT 10;

-- ============================================================================
-- 4. CREATE FUNCTION TO LOG SESSIONS
-- ============================================================================
-- Automatically create session record when user logs in

CREATE OR REPLACE FUNCTION create_user_session(
  user_id UUID,
  session_token VARCHAR,
  ip_address INET DEFAULT NULL,
  user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent)
  VALUES (user_id, session_token, ip_address, user_agent)
  RETURNING id INTO session_id;
  
  -- Update user's last login time
  UPDATE users SET last_login_at = now() WHERE id = user_id;
  
  RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. CREATE FUNCTION TO LOG INACTIVITY
-- ============================================================================
-- Log inactivity warnings and automatic logouts

CREATE OR REPLACE FUNCTION log_inactivity_event(
  user_id UUID,
  session_id UUID,
  event_type VARCHAR,
  inactivity_minutes INTEGER DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO inactivity_logs (user_id, session_id, event_type, inactivity_duration_minutes)
  VALUES (
    user_id,
    session_id,
    event_type,
    inactivity_minutes
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. CREATE FUNCTION TO END SESSION
-- ============================================================================
-- Cleanly end user session on logout

CREATE OR REPLACE FUNCTION end_user_session(
  session_token VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  session_id UUID;
BEGIN
  UPDATE user_sessions 
  SET is_active = FALSE, logout_timestamp = now()
  WHERE session_token = session_token AND is_active = TRUE
  RETURNING id INTO session_id;
  
  IF session_id IS NOT NULL THEN
    -- Log the logout event
    PERFORM log_inactivity_event(
      (SELECT user_id FROM user_sessions WHERE id = session_id),
      session_id,
      'logout'
    );
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. CREATE FUNCTION TO UPDATE LAST ACTIVITY
-- ============================================================================
-- Update last activity timestamp on user interaction

CREATE OR REPLACE FUNCTION update_session_activity(
  session_token VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_sessions 
  SET last_activity_timestamp = now()
  WHERE session_token = session_token AND is_active = TRUE;
  
  UPDATE users
  SET last_activity_at = now()
  WHERE id = (SELECT user_id FROM user_sessions WHERE session_token = session_token);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. CREATE AUDIT LOG TABLE
-- ============================================================================
-- Track admin changes and sensitive operations

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- 9. ROW LEVEL SECURITY POLICIES FOR SESSION TABLE
-- ============================================================================
-- Ensure users can only see their own sessions

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own sessions"
  ON user_sessions FOR SELECT
  USING (user_id = auth.uid()::UUID OR (SELECT role FROM users WHERE id = auth.uid()::UUID) = 'admin');

CREATE POLICY "Only admins and system can manage sessions"
  ON user_sessions FOR UPDATE
  USING ((SELECT role FROM users WHERE id = auth.uid()::UUID) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()::UUID) = 'admin');

-- ============================================================================
-- 10. ROW LEVEL SECURITY POLICIES FOR INACTIVITY LOGS
-- ============================================================================

ALTER TABLE inactivity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own inactivity logs"
  ON inactivity_logs FOR SELECT
  USING (user_id = auth.uid()::UUID OR (SELECT role FROM users WHERE id = auth.uid()::UUID) = 'admin');

CREATE POLICY "Only system can insert inactivity logs"
  ON inactivity_logs FOR INSERT
  WITH CHECK (TRUE);

-- ============================================================================
-- 11. ROW LEVEL SECURITY POLICIES FOR AUDIT LOGS
-- ============================================================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs"
  ON audit_logs FOR SELECT
  USING ((SELECT role FROM users WHERE id = auth.uid()::UUID) = 'admin');

CREATE POLICY "Only system can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (TRUE);

-- ============================================================================
-- 12. CREATE TRIGGER FOR AUDIT LOG UPDATES
-- ============================================================================
-- Automatically log changes to users table

CREATE OR REPLACE FUNCTION log_user_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, changes)
  VALUES (
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    'users',
    COALESCE(NEW.id::TEXT, OLD.id::TEXT),
    jsonb_build_object(
      'before', to_jsonb(OLD),
      'after', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_audit_trigger
AFTER UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION log_user_changes();

-- ============================================================================
-- 13. CLEAN UP INACTIVE SESSIONS (OPTIONAL MAINTENANCE)
-- ============================================================================
-- Create a function to clean up old inactive sessions
-- Schedule this with pg_cron if desired

CREATE OR REPLACE FUNCTION cleanup_old_sessions(days_ago INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_sessions
  WHERE is_active = FALSE 
    AND logout_timestamp < now() - (days_ago || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 14. VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify the setup is correct

-- Check users table has new columns
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'users' AND column_name IN ('last_login_at', 'last_activity_at', 'inactivity_timeout_minutes');

-- Check new tables exist
-- SELECT tablename FROM pg_tables WHERE tablename IN ('user_sessions', 'inactivity_logs', 'audit_logs');

-- Check functions exist
-- SELECT proname FROM pg_proc WHERE proname IN ('create_user_session', 'log_inactivity_event', 'end_user_session', 'update_session_activity', 'cleanup_old_sessions');

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Replace auth.uid() with the actual user ID from your auth system if not using Supabase Auth
-- 2. Session cleanup should be scheduled with pg_cron or your scheduler
-- 3. Review RLS policies based on your security requirements
-- 4. Monitor audit_logs regularly for suspicious activity
-- 5. Test all functions in your development environment first
