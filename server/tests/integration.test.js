const request = require('supertest');
const app = require('../src/app');

describe('Integration Tests', () => {
  it('GET /api/health should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET / should return service name or static files based on env', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('ShopSmart Backend Service');
  });
});
