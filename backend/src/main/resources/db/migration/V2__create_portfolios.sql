CREATE TABLE portfolios (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    base_currency VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);