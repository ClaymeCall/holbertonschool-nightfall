const jwt = require('jsonwebtoken');
const request = require('supertest');
const { buildApp, createMockDb } = require('../helpers/app');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

const adminToken = () => signToken({ id: 99, email: 'admin@nightfall.com', is_admin: true });
const memberToken = () => signToken({ id: 1, email: 'user1@nightfall.com', is_admin: false });

const VALID_BODY = {
  name: 'Zone radioactive',
  description: 'Franchissez le périmètre d\'une centrale évacuée en urgence.',
  image: 'zone-radioactive.jpg',
  category: 'Survie',
  duration: 90,
  intensity: 'Modérée',
  max_participants: 10,
  price: 55,
};

describe('POST /api/experiences', () => {
  it('returns 401 when no token is provided', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app).post('/api/experiences').send(VALID_BODY);

    expect(res.status).toBe(401);
  });

  it('returns 403 when the caller is not an admin', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .post('/api/experiences')
      .set('Authorization', `Bearer ${memberToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(403);
  });

  it.each([
    ['name', { ...VALID_BODY, name: '' }],
    ['description', { ...VALID_BODY, description: '' }],
    ['category', { ...VALID_BODY, category: '' }],
    ['duration', { ...VALID_BODY, duration: 0 }],
    ['intensity', { ...VALID_BODY, intensity: '' }],
    ['max_participants', { ...VALID_BODY, max_participants: -1 }],
    ['price', { ...VALID_BODY, price: -5 }],
  ])('returns 400 for an invalid %s', async (_field, body) => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .post('/api/experiences')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send(body);

    expect(res.status).toBe(400);
  });

  it('creates the experience and returns 201 with is_archived defaulted to false', async () => {
    const db = createMockDb();
    db.query
      .mockResolvedValueOnce([{ insertId: 7 }]) // insert result
      .mockResolvedValueOnce([[{ id: 7, ...VALID_BODY, price: '55.00', is_archived: 0 }]]); // select the created row

    const app = buildApp(db);

    const res = await request(app)
      .post('/api/experiences')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 7, ...VALID_BODY, price: '55.00', is_archived: 0 });

    const insertCall = db.query.mock.calls[0];
    expect(insertCall[0]).toMatch(/INSERT INTO experiences/);
    expect(insertCall[0]).not.toMatch(/is_archived/);
  });

  it('returns 500 when the database throws', async () => {
    const db = createMockDb();
    db.query.mockRejectedValueOnce(new Error('connection lost'));

    const app = buildApp(db);

    const res = await request(app)
      .post('/api/experiences')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(500);
  });
});
