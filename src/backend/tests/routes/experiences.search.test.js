const jwt = require('jsonwebtoken');
const request = require('supertest');
const { buildApp, createMockDb } = require('../helpers/app');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

const adminToken = () => signToken({ id: 99, email: 'admin@nightfall.com', is_admin: true });

const ACTIVE_EXPERIENCE = {
  id: 1,
  name: 'Bunker abandonné',
  description: 'Descendez dans un bunker militaire oublié.',
  image: 'bunker-abandonne.jpg',
  category: 'Survie',
  duration: 75,
  intensity_level: 2,
  max_participants: 10,
  price: '50.00',
  is_archived: 0,
};

describe('GET /api/experiences/search', () => {
  it('returns experiences with no filters, excluding archived ones', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/search');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([ACTIVE_EXPERIENCE]);
    expect(db.query.mock.calls[0][0]).toMatch(/WHERE is_archived = FALSE/);
    expect(db.query.mock.calls[0][1]).toEqual([]);
  });

  it('includes archived experiences for an admin', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app)
      .get('/api/experiences/search')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][0]).not.toMatch(/WHERE/);
  });

  it('searches name and description with q', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/search').query({ q: 'bunker' });

    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][0]).toMatch(/\(name LIKE \? OR description LIKE \?\)/);
    expect(db.query.mock.calls[0][1]).toEqual(['%bunker%', '%bunker%']);
  });

  it('rejects a blank q', async () => {
    const app = buildApp(createMockDb());
    const res = await request(app).get('/api/experiences/search').query({ q: '   ' });
    expect(res.status).toBe(400);
  });

  it('filters by category', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/search').query({ category: 'Survie' });

    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][0]).toMatch(/category = \?/);
    expect(db.query.mock.calls[0][1]).toEqual(['Survie']);
  });

  it('filters by min_duration', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/search').query({ min_duration: '60' });

    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][0]).toMatch(/duration >= \?/);
    expect(db.query.mock.calls[0][1]).toEqual([60]);
  });

  it('rejects a non-positive min_duration', async () => {
    const app = buildApp(createMockDb());
    const res = await request(app).get('/api/experiences/search').query({ min_duration: '0' });
    expect(res.status).toBe(400);
  });

  it('rejects min_duration greater than max_duration', async () => {
    const app = buildApp(createMockDb());
    const res = await request(app)
      .get('/api/experiences/search')
      .query({ min_duration: '90', max_duration: '60' });
    expect(res.status).toBe(400);
  });

  it('filters by max_duration', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/search').query({ max_duration: '80' });

    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][0]).toMatch(/duration <= \?/);
    expect(db.query.mock.calls[0][1]).toEqual([80]);
  });

  it('rejects a non-positive max_duration', async () => {
    const app = buildApp(createMockDb());
    const res = await request(app).get('/api/experiences/search').query({ max_duration: '0' });
    expect(res.status).toBe(400);
  });

  it('filters by max_intensity_level', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/search').query({ max_intensity_level: '3' });

    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][0]).toMatch(/intensity_level <= \?/);
    expect(db.query.mock.calls[0][1]).toEqual([3]);
  });

  it('rejects a max_intensity_level outside 1-5', async () => {
    const app = buildApp(createMockDb());
    const res = await request(app).get('/api/experiences/search').query({ max_intensity_level: '6' });
    expect(res.status).toBe(400);
  });

  it('filters by participants', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/search').query({ participants: '6' });

    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][0]).toMatch(/max_participants >= \?/);
    expect(db.query.mock.calls[0][1]).toEqual([6]);
  });

  it('filters by min_price and max_price together', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app)
      .get('/api/experiences/search')
      .query({ min_price: '20', max_price: '60' });

    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][0]).toMatch(/price >= \?/);
    expect(db.query.mock.calls[0][0]).toMatch(/price <= \?/);
    expect(db.query.mock.calls[0][1]).toEqual([20, 60]);
  });

  it('rejects min_price greater than max_price', async () => {
    const app = buildApp(createMockDb());
    const res = await request(app)
      .get('/api/experiences/search')
      .query({ min_price: '60', max_price: '20' });
    expect(res.status).toBe(400);
  });

  it('combines multiple filters in a single query', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/search').query({
      q: 'bunker',
      category: 'Survie',
      max_duration: '90',
      max_intensity_level: '3',
      participants: '4',
      min_price: '10',
      max_price: '90',
    });

    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][1]).toEqual([
      '%bunker%', '%bunker%', 'Survie', 90, 3, 4, 10, 90,
    ]);
  });

  it('returns 500 when the database throws', async () => {
    const db = createMockDb();
    db.query.mockRejectedValueOnce(new Error('connection lost'));

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/search');

    expect(res.status).toBe(500);
  });
});
