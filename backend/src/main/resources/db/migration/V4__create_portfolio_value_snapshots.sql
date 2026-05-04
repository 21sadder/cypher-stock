CREATE TABLE portfolio_value_snapshots (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    total_value DOUBLE PRECISION NOT NULL,
    total_cost DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE accounts_snapshots (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    total_value DOUBLE PRECISION NOT NULL,
    total_cost DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT NOW()
);