const mysql = require('mysql2/promise');
const descriptions = require('../content/experienceDescriptions.json');
require('dotenv').config();

// Update only the original catalogue copy. Preserve custom administrator edits,
// all prices, archived flags, users and reservations. Safe to run repeatedly.
async function updateExperienceDescriptions() {
  const revert = process.argv.includes('--revert');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  try {
    await connection.beginTransaction();
    let count = 0;
    for (const [image, copy] of Object.entries(descriptions)) {
      const [result] = await connection.execute(
        'UPDATE experiences SET description = ? WHERE image = ? AND BINARY description = ?',
        [revert ? copy.previous : copy.description, image, revert ? copy.description : copy.previous],
      );
      count += result.affectedRows;
    }
    await connection.commit();
    console.log(`${count} description(s) ${revert ? 'restaurée(s)' : 'mise(s) à jour'}.`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

updateExperienceDescriptions().catch((error) => {
  console.error('Mise à jour des descriptions impossible :', error.code || error.message);
  process.exitCode = 1;
});
