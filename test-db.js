const pool = require('./db/db');

async function main() {
  try {
    const res = await pool.query('SELECT * FROM stations');
    console.log(res.rows);
  } catch (err) {
    console.error('Erreur de connexion DB:', err);
  } finally {
    pool.end();
  }
}

main();
