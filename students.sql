-- ================================
-- Students Table
-- Database: PostgreSQL
-- ================================

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    roll VARCHAR(50) NOT NULL,
    registration VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL, 
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
