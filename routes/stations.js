const express = require('express');
const router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stations ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne" });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM stations WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Station non trouvée" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne" });
  }
});

module.exports = router;
