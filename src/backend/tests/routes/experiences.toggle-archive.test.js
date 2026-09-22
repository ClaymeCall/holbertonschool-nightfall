const jwt = require('jsonwebtoken');
const request = require('supertest');
const { buildApp, createMockDb } = require('../helpers/app');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

const adminToken = () => signToken({ id: 99, email: 'admin@nightfall.com', is_admin: true });
const memberToken = () => signToken({ id: 1, email: 'user1@nightfall.com', is_admin: false });

describe('PATCH /api/experiences/:id/toggle-archive', () => {
  it('returns 401 when no token is provided', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app).patch('/api/experiences/1/toggle-archive');

    expect(res.status).toBe(401);
  });

  it('returns 403 when the caller is not an admin', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .patch('/api/experiences/1/toggle-archive')
      .set('Authorization', `Bearer ${memberToken()}`);

    expect(res.status).toBe(403);
  });

  it('returns 400 for a non-numeric id', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .patch('/api/experiences/not-a-number/toggle-archive')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(400);
  });

  it('returns 404 when the experience does not exist', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[]]);

    const app = buildApp(db);
    const res = await request(app)
      .patch('/api/experiences/999/toggle-archive')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(404);
  });

  it('flips is_archived and returns the updated experience', async () => {
    const db = createMockDb();
    db.query
      .mockResolvedValueOnce([[{ id: 1 }]]) // existing-id lookup
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // toggle update
      .mockResolvedValueOnce([[{ id: 1, name: 'Bunker abandonné', is_archived: 1 }]]); // select the updated row

    const app = buildApp(db);
    const res = await request(app)
      .patch('/api/experiences/1/toggle-archive')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, name: 'Bunker abandonné', is_archived: 1 });
    expect(db.query).toHaveBeenNthCalledWith(
      2,
      'UPDATE experiences SET is_archived = NOT is_archived WHERE id = ?',
      [1]
    );
  });

  it('returns 500 when the database throws', async () => {
    const db = createMockDb();
    db.query.mockRejectedValueOnce(new Error('connection lost'));

    const app = buildApp(db);
    const res = await request(app)
      .patch('/api/experiences/1/toggle-archive')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(500);
  });
});
