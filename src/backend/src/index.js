const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5080;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAPI Docs
const swaggerDocument = YAML.load('openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Database connection
let db;
async function connectToDatabase() {
  const maxRetries = 5;
  const retryDelay = 3000;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      });
      console.log('Connected to MySQL database');
      return;
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
}

connectToDatabase().catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Make db available to all routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
const routes = require('./routes');
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
