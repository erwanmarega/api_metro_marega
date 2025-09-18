require('dotenv').config(); 
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: String(process.env.PGPASSWORD),
  port: Number(process.env.PGPORT), 
  max : 20,
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 20000,       
  allowExitOnIdle : false
});

module.exports = pool;
