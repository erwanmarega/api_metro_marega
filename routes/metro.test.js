const request = require('supertest');
const app = require('../server');
const pool = require('../db/db');

jest.mock('../db/db');

describe('GET /next-metro', () => {
  
  test('retourne les informations du prochain métro', async () => {
    const response = await request(app)
      .get('/next-metro')
      .query({ station: 'Châtelet' });  

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('station', 'Châtelet');
    expect(response.body).toHaveProperty('line', 'M1');
    expect(response.body).toHaveProperty('headwayMin', 3);
    expect(response.body).toHaveProperty('nextArrival', '00:30');
  });

  test('retourne une erreur 400 si station est manquant', async () => {
    const response = await request(app)
      .get('/next-metro');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('fonctionne avec n\'importe quelle station', async () => {
    const response = await request(app)
      .get('/next-metro')
      .query({ station: 'Louvre' });

    expect(response.status).toBe(200);
    expect(response.body.station).toBe('Louvre');
  });
});

describe('GET /last-metro', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retourne les informations du dernier métro', async () => {
    const mockDefaults = {
      rows: [{ value: { line: 'M1', tz: 'Europe/Paris' } }]
    };
    const mockLastMetros = {
      rows: [{
        value: {
          'Châtelet': '00:45',
          'Louvre': '00:50'
        }
      }]
    };

    pool.query
      .mockResolvedValueOnce(mockDefaults)      
      .mockResolvedValueOnce(mockLastMetros);   

    const response = await request(app)
      .get('/last-metro')
      .query({ station: 'Châtelet' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('station', 'Châtelet');
    expect(response.body).toHaveProperty('lastMetro', '00:45');
    expect(response.body).toHaveProperty('line', 'M1');
    expect(response.body).toHaveProperty('tz', 'Europe/Paris');
  });

  test('retourne une erreur 400 si la station est manquante', async () => {
    const response = await request(app)
      .get('/last-metro');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'missing station');
  });

  test('retourne une erreur 404 si la station est inconnue', async () => {
    const mockDefaults = {
      rows: [{ value: { line: 'M1', tz: 'Europe/Paris' } }]
    };
    const mockLastMetros = {
      rows: [{
        value: {
          'Châtelet': '00:45',
          'Louvre': '00:50'
        }
      }]
    };

    pool.query
      .mockResolvedValueOnce(mockDefaults)
      .mockResolvedValueOnce(mockLastMetros);

    const response = await request(app)
      .get('/last-metro')
      .query({ station: 'StationInconnue' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Station inconnue');
  });
});

