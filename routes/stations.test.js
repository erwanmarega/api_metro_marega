const request = require('supertest');
const app = require('../server');
const pool = require('../db/db');

jest.mock('../db/db');

describe('Routes /stations', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /stations', () => {

    test('devrait retourner toutes les stations', async () => {
      const mockStations = [
        { id: 1, name: 'Châtelet', line: 'M1' },
        { id: 2, name: 'Louvre', line: 'M1' }
      ];

      pool.query.mockResolvedValue({ rows: mockStations });

      const response = await request(app)
        .get('/stations');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStations);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM stations ORDER BY id');
    });

    test('devrait retourner une erreur 500 en cas de problème DB', async () => {
      pool.query.mockRejectedValue(new Error('Erreur DB'));

      const response = await request(app)
        .get('/stations');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Erreur interne');
    });
  });

  describe('GET /stations/:id', () => {

    test('devrait retourner une station par son ID', async () => {
      const mockStation = { id: 1, name: 'Châtelet', line: 'M1' };

      pool.query.mockResolvedValue({ rows: [mockStation] });

      const response = await request(app)
        .get('/stations/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStation);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM stations WHERE id=$1',
        ['1']
      );
    });

    test('devrait retourner 404 si la station n\'existe pas', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get('/stations/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Station non trouvée');
    });

    test('devrait retourner une erreur 500 en cas de problème DB', async () => {
      pool.query.mockRejectedValue(new Error('Erreur DB'));

      const response = await request(app)
        .get('/stations/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Erreur interne');
    });
  });
});
