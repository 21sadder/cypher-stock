CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    asset_type VARCHAR(10) NOT NULL,
    side VARCHAR(4) NOT NULL,
    quantity DECIMAL(18,8) NOT NULL,
    executed_price DECIMAL(18,2) NOT NULL,
    fee DECIMAL(18,2),
    executed_at TIMESTAMP DEFAULT NOW()
);