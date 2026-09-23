const jwt = require('jsonwebtoken');
const request = require('supertest');
const { buildApp, createMockDb } = require('../helpers/app');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

const adminToken = () => signToken({ id: 99, email: 'admin@nightfall.com', is_admin: true });
const memberToken = () => signToken({ id: 1, email: 'user1@nightfall.com', is_admin: false });

describe('DELETE /api/experiences/:id', () => {
  it('returns 401 when no token is provided', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app).delete('/api/experiences/1');

    expect(res.status).toBe(401);
  });

  it('returns 403 when the caller is not an admin', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .delete('/api/experiences/1')
      .set('Authorization', `Bearer ${memberToken()}`);

    expect(res.status).toBe(403);
  });

  it('returns 400 for a non-numeric id', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app)
      .delete('/api/experiences/not-a-number')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(400);
  });

  it('returns 404 when the experience does not exist', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[]]);

    const app = buildApp(db);
    const res = await request(app)
      .delete('/api/experiences/42')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(404);
  });

  it('deletes the experience and returns 204', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[{ id: 42 }]]).mockResolvedValueOnce([{ affectedRows: 1 }]);

    const app = buildApp(db);
    const res = await request(app)
      .delete('/api/experiences/42')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
    expect(db.query).toHaveBeenNthCalledWith(2, 'DELETE FROM experiences WHERE id = ?', [42]);
  });

  it('returns 409 when the experience still has reservations (FK constraint)', async () => {
    const db = createMockDb();
    const fkError = new Error('Cannot delete or update a parent row');
    fkError.code = 'ER_ROW_IS_REFERENCED_2';
    db.query.mockResolvedValueOnce([[{ id: 42 }]]).mockRejectedValueOnce(fkError);

    const app = buildApp(db);
    const res = await request(app)
      .delete('/api/experiences/42')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(409);
  });

  it('returns 500 when the database throws unexpectedly', async () => {
    const db = createMockDb();
    db.query.mockRejectedValueOnce(new Error('connection lost'));

    const app = buildApp(db);
    const res = await request(app)
      .delete('/api/experiences/42')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(500);
  });
});
