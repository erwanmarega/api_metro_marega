const request = require('supertest');
const { setupTestDB, teardownTestDB } = require('./setup');

const app = require('../server');

describe('Tests d\'intégration - Routes /last-metro (avec vraie DB)', () => {

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe('GET /last-metro', () => {

    test('devrait retourner le dernier métro pour Châtelet depuis la DB', async () => {
      const response = await request(app)
        .get('/last-metro')
        .query({ station: 'Châtelet' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('station', 'Châtelet');
      expect(response.body).toHaveProperty('lastMetro', '00:55');
      expect(response.body).toHaveProperty('line', 'M1');
      expect(response.body).toHaveProperty('tz', 'Europe/Paris');
    });

    test('devrait retourner le dernier métro pour La Défense', async () => {
      const response = await request(app)
        .get('/last-metro')
        .query({ station: 'La Défense' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('station', 'La Défense');
      expect(response.body).toHaveProperty('lastMetro', '00:40');
    });

    test('devrait retourner le dernier métro pour Nation', async () => {
      const response = await request(app)
        .get('/last-metro')
        .query({ station: 'Nation' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('station', 'Nation');
      expect(response.body).toHaveProperty('lastMetro', '01:05');
    });

    test('devrait retourner 404 pour une station inconnue', async () => {
      const response = await request(app)
        .get('/last-metro')
        .query({ station: 'StationInexistante' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Station inconnue');
    });

    test('devrait retourner 400 si le paramètre station est manquant', async () => {
      const response = await request(app)
        .get('/last-metro');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'missing station');
    });

    test('devrait être insensible à la casse', async () => {
      const response1 = await request(app)
        .get('/last-metro')
        .query({ station: 'châtelet' }); 

      const response2 = await request(app)
        .get('/last-metro')
        .query({ station: 'CHÂTELET' }); 

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.body.station).toBe('Châtelet');
      expect(response2.body.station).toBe('Châtelet');
    });

  });

});
