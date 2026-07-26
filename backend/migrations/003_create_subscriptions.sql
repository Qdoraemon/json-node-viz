-- 003: Create subscriptions table (Lemon Squeezy)
CREATE TABLE subscriptions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lemon_sub_id    VARCHAR(255) NOT NULL,
    lemon_order_id  VARCHAR(255),
    plan_tier       plan_tier NOT NULL,
    status          VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end   TIMESTAMPTZ,
    canceled_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_subscriptions_lemon_sub_id ON subscriptions (lemon_sub_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
