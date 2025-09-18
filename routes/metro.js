const express = require('express');
const router = express.Router();
const pool = require('../db/db');

router.get('/next-metro', (req, res) => {
    const {station} = req.query;

    if (!station) {
        return res.status(400).json({error: 'le paramètre station est obiligatoireeee'})
    }

    const reponse = {
        station, 
        line : "M1",
        headwayMin: 3, 
        nextArrival : "00:30"
    }

    res.status(200).json(reponse);
});



router.get('/last-metro', async (req, res) => {
    const { station } = req.query;
    if (!station) return res.status(400).json({ error: "Paramètre 'station' obligatoire" });
  
    try {
      const result = await pool.query(
        "SELECT name, line, tz, last_metro FROM stations WHERE LOWER(name) = LOWER($1)",
        [station]
      );
  
      if (result.rows.length === 0) return res.status(404).json({ error: "Station inconnue" });
  
      const row = result.rows[0];
      res.status(200).json({
        station: row.name,
        lastMetro: row.last_metro,
        line: row.line,
        tz: row.tz
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur interne" });
    }
  });

module.exports = router;