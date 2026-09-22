const jwt = require('jsonwebtoken');
const request = require('supertest');
const { buildApp, createMockDb } = require('../helpers/app');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

const adminToken = () => signToken({ id: 99, email: 'admin@nightfall.com', is_admin: true });
const memberToken = () => signToken({ id: 1, email: 'user1@nightfall.com', is_admin: false });

const ACTIVE_EXPERIENCE = {
  id: 1,
  name: 'Bunker abandonné',
  description: 'Descendez dans un bunker militaire oublié.',
  image: 'bunker-abandonne.jpg',
  category: 'Survie',
  duration: 75,
  intensity_level: 'Modérée',
  max_participants: 10,
  price: '50.00',
  is_archived: 0,
};

const ARCHIVED_EXPERIENCE = {
  ...ACTIVE_EXPERIENCE,
  id: 2,
  name: 'Forêt maudite',
  is_archived: 1,
};

describe('GET /api/experiences', () => {
  it('excludes archived experiences for an anonymous caller', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([ACTIVE_EXPERIENCE]);
    expect(db.query.mock.calls[0][0]).toMatch(/WHERE is_archived = FALSE/);
  });

  it('excludes archived experiences for a non-admin member', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app)
      .get('/api/experiences')
      .set('Authorization', `Bearer ${memberToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([ACTIVE_EXPERIENCE]);
    expect(db.query.mock.calls[0][0]).toMatch(/WHERE is_archived = FALSE/);
  });

  it('includes archived experiences for an admin', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE, ARCHIVED_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app)
      .get('/api/experiences')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([ACTIVE_EXPERIENCE, ARCHIVED_EXPERIENCE]);
    expect(db.query.mock.calls[0][0]).not.toMatch(/WHERE is_archived/);
  });

  it('returns 500 when the database throws', async () => {
    const db = createMockDb();
    db.query.mockRejectedValueOnce(new Error('connection lost'));

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences');

    expect(res.status).toBe(500);
  });
});

describe('GET /api/experiences/:id', () => {
  it('returns 400 for a non-numeric id', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app).get('/api/experiences/not-a-number');

    expect(res.status).toBe(400);
  });

  it('returns 404 when the experience does not exist', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/999');

    expect(res.status).toBe(404);
  });

  it('returns 404 for an archived experience when the caller is anonymous', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ARCHIVED_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/2');

    expect(res.status).toBe(404);
  });

  it('returns 404 for an archived experience when the caller is a non-admin member', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ARCHIVED_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app)
      .get('/api/experiences/2')
      .set('Authorization', `Bearer ${memberToken()}`);

    expect(res.status).toBe(404);
  });

  it('returns the archived experience when the caller is an admin', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ARCHIVED_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app)
      .get('/api/experiences/2')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(ARCHIVED_EXPERIENCE);
  });

  it('returns an active experience for an anonymous caller', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[ACTIVE_EXPERIENCE]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/experiences/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(ACTIVE_EXPERIENCE);
  });
});
