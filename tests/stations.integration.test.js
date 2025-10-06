const request = require('supertest');
const { setupTestDB, teardownTestDB, pool } = require('./setup');

const app = require('../server');

describe('Tests d\'intégration - Routes /stations (avec vraie DB)', () => {

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe('GET /stations', () => {

    test('devrait retourner toutes les stations depuis la DB', async () => {
      const response = await request(app)
        .get('/stations');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(4); 

      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('line');
      expect(response.body[0]).toHaveProperty('last_metro');

      const stations = response.body.map(s => s.name);
      expect(stations).toContain('Châtelet');
      expect(stations).toContain('La Défense');
    });

  });

  describe('GET /stations/:id', () => {

    test('devrait retourner une station spécifique par son ID', async () => {
      const response = await request(app)
        .get('/stations/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'La Défense');
      expect(response.body).toHaveProperty('line', 'M1');
    });

    test('devrait retourner 404 pour une station inexistante', async () => {
      const response = await request(app)
        .get('/stations/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Station non trouvée');
    });

    test('devrait retourner la bonne station pour chaque ID', async () => {
      const response1 = await request(app).get('/stations/3');
      expect(response1.body.name).toBe('Châtelet');

      const response2 = await request(app).get('/stations/4');
      expect(response2.body.name).toBe('Nation');
    });

  });

});
