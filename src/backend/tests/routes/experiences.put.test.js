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
  intensity_level: 2,
  max_participants: 10,
  price: 55,
};

describe('PUT /api/experiences/:id', () => {
  it('returns 401 when no token is provided', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app).put('/api/experiences/1').send(VALID_BODY);

    expect(res.status).toBe(401);
  });

  it('returns 403 when the caller is not an admin', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .put('/api/experiences/1')
      .set('Authorization', `Bearer ${memberToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(403);
  });

  it('returns 400 for a non-numeric id', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .put('/api/experiences/not-a-number')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid body', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .put('/api/experiences/1')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({ ...VALID_BODY, price: -5 });

    expect(res.status).toBe(400);
  });

  it('returns 404 when the experience does not exist', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[]]);

    const app = buildApp(db);
    const res = await request(app)
      .put('/api/experiences/999')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(404);
  });

  it('updates the experience without touching is_archived', async () => {
    const db = createMockDb();
    db.query
      .mockResolvedValueOnce([[{ id: 1 }]]) // existing-id lookup
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // update
      .mockResolvedValueOnce([[{ id: 1, ...VALID_BODY, price: '55.00', is_archived: 0 }]]); // select the updated row

    const app = buildApp(db);
    const res = await request(app)
      .put('/api/experiences/1')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, ...VALID_BODY, price: '55.00', is_archived: 0 });

    const updateCall = db.query.mock.calls[1];
    expect(updateCall[0]).toMatch(/UPDATE experiences/);
    expect(updateCall[0]).not.toMatch(/is_archived/);
  });

  it('returns 500 when the database throws', async () => {
    const db = createMockDb();
    db.query.mockRejectedValueOnce(new Error('connection lost'));

    const app = buildApp(db);
    const res = await request(app)
      .put('/api/experiences/1')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(500);
  });
});
