-- Drop tables if they exist
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS crypto_transactions;
DROP TABLE IF EXISTS accounts;

-- Drop database if it exists
DROP DATABASE IF EXISTS cryptometricsdb;

-- Create a new database for the CryptoMetrics project
CREATE DATABASE cryptometricsdb;
\c cryptometricsdb;

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE crypto_transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    id VARCHAR(15) NOT NULL,
    transaction_type VARCHAR(4) NOT NULL, -- 'BUY' or 'SELL'
    amount DECIMAL(18, 8) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE crypto_transactions
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES accounts(id);

CREATE TABLE favorites (
    user_id INT,
    coin_id VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, coin_id),
    FOREIGN KEY (user_id) REFERENCES accounts(id)
);

-- Insert data only if the table is empty
INSERT INTO accounts (username, password)
SELECT 'exampleUser', 'examplePassword'
WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE username = 'exampleUser');
