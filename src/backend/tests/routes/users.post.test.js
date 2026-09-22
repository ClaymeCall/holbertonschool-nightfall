const jwt = require('jsonwebtoken');
const request = require('supertest');
const { buildApp, createMockDb } = require('../helpers/app');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

const adminToken = () => signToken({ id: 99, email: 'admin@nightfall.com', is_admin: true });
const memberToken = () => signToken({ id: 1, email: 'user1@nightfall.com', is_admin: false });

const VALID_BODY = { email: 'new.user@nightfall.com', password: 'password123' };

describe('POST /api/users', () => {
  it('returns 401 when no token is provided', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app).post('/api/users').send(VALID_BODY);

    expect(res.status).toBe(401);
  });

  it('returns 401 for an invalid token', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', 'Bearer garbage')
      .send(VALID_BODY);

    expect(res.status).toBe(401);
  });

  it('returns 403 when the caller is not an admin', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${memberToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(403);
  });

  it('returns 400 for a missing/invalid email', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({ email: 'not-an-email', password: 'password123' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for a password shorter than 8 characters', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({ email: 'new.user@nightfall.com', password: 'short' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when is_admin is not a boolean', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({ ...VALID_BODY, is_admin: 'yes' });

    expect(res.status).toBe(400);
  });

  it('returns 409 when the email is already taken', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[{ id: 1 }]]); // existing-email lookup

    const app = buildApp(db);

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(409);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it('creates the user and returns 201 without the password hash', async () => {
    const db = createMockDb();
    db.query
      .mockResolvedValueOnce([[]]) // no existing user with that email
      .mockResolvedValueOnce([{ insertId: 7 }]) // insert result
      .mockResolvedValueOnce([
        [{ id: 7, email: VALID_BODY.email, is_admin: 0, created_at: '2026-01-01T00:00:00.000Z' }],
      ]); // select the created row

    const app = buildApp(db);

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 7,
      email: VALID_BODY.email,
      is_admin: 0,
      created_at: '2026-01-01T00:00:00.000Z',
    });
    expect(res.body.password).toBeUndefined();
    expect(res.body.password_hash).toBeUndefined();

    // The password must have been hashed before hitting the INSERT.
    const insertCall = db.query.mock.calls[1];
    expect(insertCall[0]).toMatch(/INSERT INTO users/);
    const [insertedEmail, insertedHash, insertedIsAdmin] = insertCall[1];
    expect(insertedEmail).toBe(VALID_BODY.email);
    expect(insertedHash).not.toBe(VALID_BODY.password);
    expect(insertedIsAdmin).toBe(false);
  });

  it('defaults is_admin to false when not provided', async () => {
    const db = createMockDb();
    db.query
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 8 }])
      .mockResolvedValueOnce([[{ id: 8, email: VALID_BODY.email, is_admin: 0, created_at: 'now' }]]);

    const app = buildApp(db);

    await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send(VALID_BODY);

    const [, insertedHash, insertedIsAdmin] = db.query.mock.calls[1][1];
    expect(insertedIsAdmin).toBe(false);
    expect(insertedHash).toBeDefined();
  });

  it('honors is_admin: true when creating another admin', async () => {
    const db = createMockDb();
    db.query
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ insertId: 9 }])
      .mockResolvedValueOnce([[{ id: 9, email: VALID_BODY.email, is_admin: 1, created_at: 'now' }]]);

    const app = buildApp(db);

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({ ...VALID_BODY, is_admin: true });

    expect(res.status).toBe(201);
    const [, , insertedIsAdmin] = db.query.mock.calls[1][1];
    expect(insertedIsAdmin).toBe(true);
  });

  it('returns 500 when the database throws', async () => {
    const db = createMockDb();
    db.query.mockRejectedValueOnce(new Error('connection lost'));

    const app = buildApp(db);

    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send(VALID_BODY);

    expect(res.status).toBe(500);
  });
});
