DROP TABLE IF EXISTS stations;

CREATE TABLE stations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  line TEXT NOT NULL,
  tz TEXT NOT NULL DEFAULT 'Europe/Paris',
  headway_min INT NOT NULL DEFAULT 3,
  last_metro TIME NOT NULL
);

