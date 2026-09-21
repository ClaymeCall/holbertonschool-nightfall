const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

let connection;

const seedDatabase = async () => {
    try {
        // Create connection to MySQL with retry logic
        const maxRetries = 5;
        const retryDelay = 3000;
        let retries = 0;

        while (retries < maxRetries) {
            try {
                connection = await mysql.createConnection({
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT,
                });
                console.log('Connected to MySQL database');
                break;
            } catch (err) {
                retries++;
                console.error(`Database connection failed (attempt ${retries}/${maxRetries}):`, err);
                if (retries < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                } else {
                    throw err;
                }
            }
        }

        // Create tables
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                is_admin BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
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
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS reservations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                experience_id INT NOT NULL,
                user_id INT NOT NULL,
                date_time DATETIME NOT NULL,
                participants INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (experience_id) REFERENCES experiences(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // Reset existing data so the script can be run repeatedly (respect FK order)
        await connection.query('DELETE FROM reservations');
        await connection.query('DELETE FROM experiences');
        await connection.query('DELETE FROM users');

        // Hash passwords
        const userPassword = await bcrypt.hash('password123', 10);
        const adminPassword = await bcrypt.hash('admin123', 10);

        // Seed users
        await connection.query(
            'INSERT INTO users (email, password_hash, is_admin) VALUES (?, ?, ?)',
            ['user1@nightfall.com', userPassword, false]
        );
        await connection.query(
            'INSERT INTO users (email, password_hash, is_admin) VALUES (?, ?, ?)',
            ['user2@nightfall.com', userPassword, false]
        );
        await connection.query(
            'INSERT INTO users (email, password_hash, is_admin) VALUES (?, ?, ?)',
            ['admin@nightfall.com', adminPassword, true]
        );

        // Seed experiences
        const experiences = [
            {
                name: 'Spooky Kayaking',
                description: 'Paddle through calm waters as the sun sets over the horizon. Perfect for beginners and experienced kayakers alike.',
                image: 'sunset-kayaking.jpg',
                category: 'Water',
                duration: 120,
                intensity_level: 'Moderate',
                max_participants: 12,
                price: 45.00
            },
            {
                name: 'Jungle Trekking',
                description: 'Explore dense jungle trails with a certified guide. Discover hidden waterfalls and exotic wildlife.',
                image: 'jungle-trekking.jpg',
                category: 'Adventure',
                duration: 180,
                intensity_level: 'High',
                max_participants: 10,
                price: 60.00
            },
            {
                name: 'Yoga Retreat',
                description: 'Join a peaceful yoga session in a serene natural setting. Suitable for all levels.',
                image: 'yoga-retreat.jpg',
                category: 'Wellness',
                duration: 90,
                intensity_level: 'Low',
                max_participants: 20,
                price: 30.00
            },
            {
                name: 'Mountain Climbing',
                description: 'Challenge yourself with a guided climb up steep mountain trails. Equipment provided.',
                image: 'mountain-climbing.jpg',
                category: 'Adventure',
                duration: 240,
                intensity_level: 'Very High',
                max_participants: 8,
                price: 80.00
            },
            {
                name: 'Beach Cleanup',
                description: 'Participate in a community-driven beach cleanup initiative. Great for team building.',
                image: 'beach-cleanup.jpg',
                category: 'Community',
                duration: 150,
                intensity_level: 'Low',
                max_participants: 25,
                price: 0.00
            }
        ];

        for (const experience of experiences) {
            await connection.query(
                'INSERT INTO experiences (name, description, image, category, duration, intensity_level, max_participants, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    experience.name,
                    experience.description,
                    experience.image,
                    experience.category,
                    experience.duration,
                    experience.intensity_level,
                    experience.max_participants,
                    experience.price
                ]
            );
        }

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exitCode = 1;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run the seed function
seedDatabase();
