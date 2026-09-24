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

        // DB_HOST is normally the docker-compose service name ("database"),
        // which only resolves inside the compose network. When the script is
        // run directly on the host, fall back to localhost, which works
        // because the database port is published to the host.
        const primaryHost = process.env.DB_HOST || 'localhost';
        const fallbackHost = primaryHost !== 'localhost' ? 'localhost' : null;
        let currentHost = primaryHost;

        while (retries < maxRetries) {
            try {
                connection = await mysql.createConnection({
                    host: currentHost,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT,
                });
                console.log(`Connected to MySQL database at ${currentHost}`);
                break;
            } catch (err) {
                retries++;
                console.error(`Database connection failed (attempt ${retries}/${maxRetries}):`, err);
                if (err.code === 'ENOTFOUND' && fallbackHost && currentHost !== fallbackHost) {
                    console.warn(`Host "${currentHost}" could not be resolved, retrying with "${fallbackHost}"`);
                    currentHost = fallbackHost;
                }
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
                intensity_level TINYINT NOT NULL CHECK (intensity_level BETWEEN 1 AND 5),
                max_participants INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                is_archived BOOLEAN NOT NULL DEFAULT FALSE,
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
        const [user1Result] = await connection.query(
            'INSERT INTO users (email, password_hash, is_admin) VALUES (?, ?, ?)',
            ['user1@nightfall.com', userPassword, false]
        );
        const [user2Result] = await connection.query(
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
                name: 'Laboratoire contaminé',
                description: 'Les portes du laboratoire viennent de se verrouiller. À l’intérieur, les recherches sur un mystérieux agent biologique ont tourné court… et votre équipe est le dernier espoir de retrouver l’antidote.\n\nExplorez les salles de recherche, rassemblez les indices et confrontez vos découvertes pour reconstituer le protocole. Entre observation et esprit d’équipe, cette aventure vous plonge dans un univers de science-fiction horrifique où chaque décision peut faire basculer la mission.',
                image: 'laboratoire-contamine.jpg',
                category: 'Horreur',
                duration: 90,
                intensity_level: 3,
                max_participants: 8,
                price: 55.00
            },
            {
                name: 'Bunker abandonné',
                description: 'Un dernier message radio vous conduit aux portes d’un bunker oublié. Sous terre, les équipements sont encore en place, mais l’équipe qui occupait les lieux a disparu sans laisser d’explication.\n\nEn groupe, explorez les installations, recoupez les informations et découvrez ce qui s’est passé avant de retrouver la sortie. Une expérience de survie immersive qui mise sur le suspense, l’exploration et la coopération, dans l’atmosphère confinée d’un abri militaire.',
                image: 'bunker-abandonne.jpg',
                category: 'Survie',
                duration: 75,
                intensity_level: 2,
                max_participants: 10,
                price: 50.00
            },
            {
                name: 'Asile abandonné',
                description: 'L’établissement est fermé depuis des années. Pourtant, une lumière brille encore au bout du couloir et des bruits de pas résonnent derrière les portes. Votre équipe est venue éclaircir les circonstances de sa fermeture. Quelqu’un semble vous attendre.\n\nSuivez les traces du passé, explorez les pièces abandonnées et rassemblez les éléments d’une histoire restée inachevée. Un parcours d’horreur surnaturelle où l’observation et l’entraide seront vos meilleurs alliés face aux présences qui habitent les lieux.',
                image: 'asile-abandonne.jpg',
                category: 'Horreur',
                duration: 100,
                intensity_level: 3,
                max_participants: 8,
                price: 65.00
            },
            {
                name: 'Invasion extraterrestre',
                description: 'Un objet non identifié s’est écrasé à proximité de la base. Depuis, les communications sont brouillées et les relevés indiquent une présence qui ne ressemble à rien de connu. Votre équipe est envoyée sur place pour comprendre la situation.\n\nInspectez les installations, interprétez les indices et coordonnez vos recherches pour retrouver la créature avant qu’elle ne vous trouve. Une aventure de science-fiction sous tension, à vivre en équipe entre enquête, exploration et menace extraterrestre.',
                image: 'invasion-extraterrestre.jpg',
                category: 'Science-fiction',
                duration: 100,
                intensity_level: 4,
                max_participants: 8,
                price: 70.00
            },
            {
                name: 'Zone radioactive',
                description: 'La centrale a été évacuée, mais des données essentielles sont restées à l’intérieur. Votre équipe doit franchir le périmètre de sécurité et mener une dernière opération de récupération avant la fermeture de la zone.\n\nRepérez votre itinéraire, rassemblez les informations et organisez votre progression pour accomplir la mission. Ce scénario de catastrophe fictive fait de la gestion du temps et de la coopération les clés de votre sortie : ici, le danger se joue, les décisions se prennent ensemble.',
                image: 'zone-radioactive.jpg',
                category: 'Survie',
                duration: 90,
                intensity_level: 2,
                max_participants: 10,
                price: 55.00
            },
            {
                name: 'Forêt maudite',
                description: 'À la tombée de la nuit, le sentier disparaît et les repères deviennent incertains. On raconte que cette forêt garde la mémoire de ceux qui s’y sont aventurés. Votre groupe va devoir démêler la légende pour retrouver son chemin.\n\nObservez les traces, échangez vos découvertes et restez unis pour progresser dans ce parcours aux frontières du fantastique. Une aventure d’exploration et de suspense où chaque détour vous entraîne un peu plus loin dans le mystère.',
                image: 'foret-maudite.jpg',
                category: 'Horreur',
                duration: 75,
                intensity_level: 2,
                max_participants: 12,
                price: 45.00,
                is_archived: true
            }
        ];

        const experienceIds = [];
        for (const experience of experiences) {
            const [experienceResult] = await connection.query(
                'INSERT INTO experiences (name, description, image, category, duration, intensity_level, max_participants, price, is_archived) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    experience.name,
                    experience.description,
                    experience.image,
                    experience.category,
                    experience.duration,
                    experience.intensity_level,
                    experience.max_participants,
                    experience.price,
                    Boolean(experience.is_archived)
                ]
            );
            experienceIds.push(experienceResult.insertId);
        }

        // Seed reservations so admin/user1 and admin/user2 relationships have sample data
        const reservations = [
            { userId: user1Result.insertId, experienceId: experienceIds[0], date_time: '2026-10-03 20:00:00', participants: 2 },
            { userId: user1Result.insertId, experienceId: experienceIds[2], date_time: '2026-10-10 21:30:00', participants: 4 },
            { userId: user2Result.insertId, experienceId: experienceIds[1], date_time: '2026-10-05 19:00:00', participants: 3 },
        ];

        for (const reservation of reservations) {
            await connection.query(
                'INSERT INTO reservations (experience_id, user_id, date_time, participants) VALUES (?, ?, ?, ?)',
                [reservation.experienceId, reservation.userId, reservation.date_time, reservation.participants]
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
