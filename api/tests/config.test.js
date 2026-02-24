import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../app'; // This will be the express app

describe('GET /config', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/config');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('config');
    expect(response.body).toHaveProperty('login_type');
    expect(response.body).toHaveProperty('ready');
  });

  it('should handle non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    // If config exists, it returns 404 handled by * catch-all inside setRoutes
    // But if setRoutes wasn't called properly, it might be 404 default express
    expect(response.status).toBe(404);
  });
});
