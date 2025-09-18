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
  const station = (req.query.station || '').toString().trim();
  console.log(`Requête reçue pour la station : ${station}`);
    if (!station) {
      return res.status(400).json({ error: "missing station" });
    }

  try {
    const defaultsResult = await pool.query("SELECT value FROM config WHERE key='metro.defaults'");
    const defaults = defaultsResult.rows[0]?.value;

    const lastResult = await pool.query("SELECT value FROM config WHERE key='metro.last'");
    const lastMetros = lastResult.rows[0]?.value;

    const foundKey = Object.keys(lastMetros).find(
      name => name.toLowerCase() === station.toLowerCase()
    );

    if (!foundKey) return res.status(404).json({ error: "Station inconnue" });

    res.status(200).json({
      station: foundKey,
      lastMetro: lastMetros[foundKey],
      line: defaults.line,
      tz: defaults.tz
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne" });
  }
});


module.exports = router;