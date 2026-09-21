-- Create database if not exists (handled by MySQL Docker entrypoint)
USE nightfall;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('visitor', 'member', 'admin') NOT NULL DEFAULT 'visitor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    category VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    intensity_level VARCHAR(50) NOT NULL,
    max_participants INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    experience_id INT NOT NULL,
    user_id INT NOT NULL,
    date_time DATETIME NOT NULL,
    participants INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (experience_id) REFERENCES experiences(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO experiences (name, description, image, category, duration, intensity_level, max_participants, price) VALUES
('Spooky Kayaking', 'Paddle through calm waters as the sun sets over the horizon. Perfect for beginners and experienced kayakers alike.', 'sunset-kayaking.jpg', 'Water', 120, 'Moderate', 12, 45.00),
('Jungle Trekking', 'Explore dense jungle trails with a certified guide. Discover hidden waterfalls and exotic wildlife.', 'jungle-trekking.jpg', 'Adventure', 180, 'High', 10, 60.00),
('Yoga Retreat', 'Join a peaceful yoga session in a serene natural setting. Suitable for all levels.', 'yoga-retreat.jpg', 'Wellness', 90, 'Low', 20, 30.00),
('Mountain Climbing', 'Challenge yourself with a guided climb up steep mountain trails. Equipment provided.', 'mountain-climbing.jpg', 'Adventure', 240, 'Very High', 8, 80.00),
('Beach Cleanup', 'Participate in a community-driven beach cleanup initiative. Great for team building.', 'beach-cleanup.jpg', 'Community', 150, 'Low', 25, 0.00);
