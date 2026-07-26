-- Track user click events for analytics
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL DEFAULT 'click',
    feature VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_feature ON events(feature);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_type ON events(event_type);
