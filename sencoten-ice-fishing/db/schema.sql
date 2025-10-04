-- Create Database
CREATE DATABASE IF NOT EXISTS sencoten_game;
USE sencoten_game;

-- Vocabulary Table
CREATE TABLE IF NOT EXISTS vocabulary (
    id INT PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(100) NOT NULL,
    translation VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    difficulty INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- High Scores Table
CREATE TABLE IF NOT EXISTS scores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    player_name VARCHAR(50),
    score INT NOT NULL,
    words_caught INT DEFAULT 0,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game Sessions Table (optional - for tracking progress)
CREATE TABLE IF NOT EXISTS game_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    player_name VARCHAR(50),
    score INT DEFAULT 0,
    lives_remaining INT DEFAULT 3,
    words_caught TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL
);

-- Indexes for better performance
CREATE INDEX idx_score ON scores(score DESC);
CREATE INDEX idx_created_at ON scores(created_at DESC);
CREATE INDEX idx_word ON vocabulary(word);