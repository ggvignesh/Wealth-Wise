-- WealthWise Database Setup Script
-- Run this in MySQL before starting the backend

-- Create database
CREATE DATABASE IF NOT EXISTS wealthwise_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE wealthwise_db;

-- Create a dedicated MySQL user (optional but recommended)
-- Replace 'your_password' with a strong password
CREATE USER IF NOT EXISTS 'wealthwise_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON wealthwise_db.* TO 'wealthwise_user'@'localhost';
FLUSH PRIVILEGES;

-- The tables are auto-created by SQLAlchemy on first run.
-- This script just sets up the database and user.

SELECT 'WealthWise database created successfully!' AS status;
