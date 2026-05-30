-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'admin'
                CHECK (role IN ('admin', 'viewer')),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Seed one default admin account
-- password is: admin123 (will be hashed by the seed script)
-- DO NOT store plaintext passwords
