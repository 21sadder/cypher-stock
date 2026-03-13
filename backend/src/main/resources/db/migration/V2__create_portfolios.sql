CREATE TABLE portfolios (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    coin_symbol VARCHAR(10) NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    average_price DECIMAL(18,2),
    created_at TIMESTAMP DEFAULT NOW()
);