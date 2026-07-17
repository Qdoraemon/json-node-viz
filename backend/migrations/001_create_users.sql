-- 001: Create users table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE plan_tier AS ENUM ('free', 'pro', 'team');

CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    plan        plan_tier NOT NULL DEFAULT 'free',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);
