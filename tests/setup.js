require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'metro',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'metro_test',
  password: process.env.PGPASSWORD || 'metro',
  port: Number(process.env.PGPORT) || 5432,
});

async function setupTestDB() {
  try {
    await pool.query('DROP TABLE IF EXISTS stations CASCADE');
    await pool.query('DROP TABLE IF EXISTS config CASCADE');

    await pool.query(`
      CREATE TABLE stations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        line TEXT NOT NULL,
        tz TEXT NOT NULL DEFAULT 'Europe/Paris',
        headway_min INT NOT NULL DEFAULT 3,
        last_metro TIME NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE config (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL
      )
    `);

    await pool.query(`
      INSERT INTO stations (name, line, headway_min, last_metro) VALUES
        ('La Défense', 'M1', 3, '00:40'),
        ('Champs-Élysées - Clemenceau', 'M1', 3, '00:45'),
        ('Châtelet', 'M1', 3, '00:55'),
        ('Nation', 'M1', 3, '01:05')
    `);

    await pool.query(`
      INSERT INTO config (key, value) VALUES
        ('metro.defaults', '{"line": "M1", "tz": "Europe/Paris"}')
    `);

    await pool.query(`
      INSERT INTO config (key, value) VALUES
        ('metro.last', '{
          "La Défense": "00:40",
          "Champs-Élysées - Clemenceau": "00:45",
          "Châtelet": "00:55",
          "Nation": "01:05"
        }')
    `);
    console.log('Base de données de test réussie');
  } catch (error) {
    console.error('Erreur test échoué ', error);
    throw error;
  }
}

async function teardownTestDB() {
  try {
    await pool.query('DROP TABLE IF EXISTS stations CASCADE');
    await pool.query('DROP TABLE IF EXISTS config CASCADE');
    await pool.end();
    console.log('Nettoyage est clean');
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error);
    throw error;
  }
}

module.exports = { setupTestDB, teardownTestDB, pool };
