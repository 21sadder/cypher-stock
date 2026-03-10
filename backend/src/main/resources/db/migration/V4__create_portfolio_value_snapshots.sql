CREATE TABLE portfolio_value_snapshots (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    total_value NUMERIC(18,2) NOT NULL,
    currency VARCHAR(10) NOT NULL
);