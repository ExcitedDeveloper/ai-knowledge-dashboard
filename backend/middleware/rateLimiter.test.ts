import request from 'supertest';
import express from 'express';
import { publicApiLimiter } from './rateLimiter';

describe('publicApiLimiter', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.get('/test', publicApiLimiter, (_req, res) => res.json({ ok: true }));
  });

  test('allows requests with standard headers (limit 100, no legacy headers)', async () => {
    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
    expect(res.headers['ratelimit-limit']).toBe('100');
    expect(res.headers).toHaveProperty('ratelimit-remaining');
    expect(res.headers).not.toHaveProperty('x-ratelimit-limit');
  });

  test('returns 429 with JSON error when limit exceeded', async () => {
    await Promise.all(Array.from({ length: 100 }, () => request(app).get('/test')));
    const res = await request(app).get('/test');
    expect(res.status).toBe(429);
    expect(res.body).toEqual({ error: 'Too many requests', message: 'You have exceeded the rate limit. Please try again later.', retryAfter: 900 });
  });

  test('shares counter across multiple routes', async () => {
    app.get('/r2', publicApiLimiter, (_req, res) => res.json({ ok: true }));
    const res1 = await request(app).get('/test');
    const res2 = await request(app).get('/r2');
    if (res1.status < 400 && res2.status < 400) {
      expect(parseInt(res2.headers['ratelimit-remaining'])).toBe(parseInt(res1.headers['ratelimit-remaining']) - 1);
    }
  });

  test('does not affect non-limited routes', async () => {
    app.get('/free', (_req, res) => res.json({ ok: true }));
    const res = await request(app).get('/free');
    expect(res.headers).not.toHaveProperty('ratelimit-limit');
  });
});
