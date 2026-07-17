-- 002: Create files table (cloud storage)
CREATE TABLE files (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL DEFAULT 'untitled',
    content     TEXT NOT NULL DEFAULT '',
    format      VARCHAR(10) NOT NULL DEFAULT 'json',
    size_bytes  BIGINT NOT NULL DEFAULT 0,
    is_public   BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_files_user_id ON files (user_id);
CREATE INDEX idx_files_user_updated ON files (user_id, updated_at DESC);
