const request = require('supertest');
const { createApp } = require('../src/app');

describe('POST /average', () => {
  let app;
  beforeEach(() => {
    app = createApp();
  });

  test('returns the number itself on first submission', async () => {
    const res = await request(app).post('/average').send({ number: 10 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ average: 10, count: 1 });
  });

  test('returns the running average of all submitted numbers', async () => {
    await request(app).post('/average').send({ number: 10 });
    await request(app).post('/average').send({ number: 20 });
    const res = await request(app).post('/average').send({ number: 30 });
    expect(res.body.average).toBe(20);
    expect(res.body.count).toBe(3);
  });

  test('handles negative and decimal numbers', async () => {
    await request(app).post('/average').send({ number: -5 });
    const res = await request(app).post('/average').send({ number: 2.5 });
    expect(res.body.average).toBe(-1.25);
  });

  test('rejects a missing number', async () => {
    const res = await request(app).post('/average').send({});
    expect(res.status).toBe(400);
  });

  test('rejects non-numeric values', async () => {
    const res = await request(app).post('/average').send({ number: '5' });
    expect(res.status).toBe(400);
  });

  test('rejects malformed JSON', async () => {
    const res = await request(app)
      .post('/average')
      .set('Content-Type', 'application/json')
      .send('{bad');
    expect(res.status).toBe(400);
  });

  test('invalid input does not affect the running average', async () => {
    await request(app).post('/average').send({ number: 4 });
    await request(app).post('/average').send({ number: 'x' });
    const res = await request(app).post('/average').send({ number: 8 });
    expect(res.body).toEqual({ average: 6, count: 2 });
  });
});
