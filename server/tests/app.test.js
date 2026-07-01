import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';

test('App Smoke Test', async (t) => {
  await t.test('should return 200 OK for /health', async () => {
    const res = await request(app).get('/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'OK');
  });

  await t.test('should return 404 for unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    assert.strictEqual(res.statusCode, 404);
  });
});

import { after } from 'node:test';
after(() => {
  process.exit(0);
});
