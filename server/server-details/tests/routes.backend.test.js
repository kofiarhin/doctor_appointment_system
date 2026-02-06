const request = require('supertest');
const app = require('../app');
const { expectedMarkers, isAppRoute } = require('../models/routeExpectations');

describe('backend route responses', () => {
  test('contact route responds correctly', async () => {
    const response = await request(app).get('/contact');
    expect(response.status).toBe(200);
    expect(isAppRoute('/contact')).toBe(true);
    expect(response.text.includes(expectedMarkers('/contact')[0])).toBe(true);
  });

  test('register route responds correctly', async () => {
    const response = await request(app).get('/register');
    expect(response.status).toBe(200);
    expect(isAppRoute('/register')).toBe(true);
    expect(response.text.includes(expectedMarkers('/register')[0])).toBe(true);
  });

  test('health endpoint responds with json', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
