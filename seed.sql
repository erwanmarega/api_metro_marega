INSERT INTO stations (name, line, headway_min, last_metro) VALUES
  ('La Défense', 'M1', 3, '00:40'),
  ('Champs-Élysées - Clemenceau', 'M1', 3, '00:45'),
  ('Châtelet', 'M1', 3, '00:55'),
  ('Nation', 'M1', 3, '01:05');
  

INSERT INTO config (key, value) VALUES
  ('metro.defaults', '{"line": "M1", "tz": "Europe/Paris"}');

INSERT INTO config (key, value) VALUES
  ('metro.last', '{
    "La Défense": "00:40",
    "Champs-Élysées - Clemenceau": "00:45",
    "Châtelet": "00:55",
    "Nation": "01:05"
  }');
