CREATE TABLE trade_history (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    type VARCHAR(10) NOT NULL,
    side VARCHAR(4) NOT NULL,
    quantity FLOAT8 NOT NULL,
    price FLOAT8 NOT NULL,
    total FLOAT8 NOT NULL,
    executed_at TIMESTAMP DEFAULT NOW()
);