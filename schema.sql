DROP TABLE IF EXISTS stations;

CREATE TABLE stations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  line TEXT NOT NULL,
  tz TEXT NOT NULL DEFAULT 'Europe/Paris',
  headway_min INT NOT NULL DEFAULT 3,
  last_metro TIME NOT NULL
);

INSERT INTO stations (name, line, headway_min, last_metro) VALUES
  ('La Défense', 'M1', 3, '00:40'),
  ('Champs-Élysées - Clemenceau', 'M1', 3, '00:45'),
  ('Châtelet', 'M1', 3, '00:55'),
  ('Nation', 'M1', 3, '01:05');
