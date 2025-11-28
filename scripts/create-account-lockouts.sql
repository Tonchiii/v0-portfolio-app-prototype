-- Create account lockout table
-- Run this in your database console or via migration

CREATE TABLE IF NOT EXISTS account_lockouts (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  failed_attempts INT DEFAULT 0,
  locked_until TIMESTAMP,
  last_attempt TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_lockouts_email ON account_lockouts(email);
CREATE INDEX idx_lockouts_locked_until ON account_lockouts(locked_until);
