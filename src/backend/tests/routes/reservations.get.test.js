const jwt = require('jsonwebtoken');
const request = require('supertest');
const { buildApp, createMockDb } = require('../helpers/app');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

const memberToken = () => signToken({ sub: 1, email: 'user1@nightfall.com', is_admin: false });

describe('GET /api/reservations', () => {
  it('returns 401 when no token is provided', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app).get('/api/reservations');

    expect(res.status).toBe(401);
  });

  it("returns the authenticated user's reservations with the experience nested", async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([
      [
        {
          id: 10,
          date_time: '2026-03-01T20:00:00.000Z',
          participants: 2,
          created_at: '2026-02-01T00:00:00.000Z',
          experience_id: 5,
          experience_name: 'Bunker abandonné',
          experience_image: 'bunker.jpg',
          experience_category: 'Survie',
          experience_duration: 75,
          experience_price: '50.00',
        },
      ],
    ]);

    const app = buildApp(db);
    const res = await request(app).get('/api/reservations').set('Authorization', `Bearer ${memberToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 10,
        date_time: '2026-03-01T20:00:00.000Z',
        participants: 2,
        created_at: '2026-02-01T00:00:00.000Z',
        experience: {
          id: 5,
          name: 'Bunker abandonné',
          image: 'bunker.jpg',
          category: 'Survie',
          duration: 75,
          price: '50.00',
        },
      },
    ]);

    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE r.user_id = ?'), [1]);
  });

  it('returns 200 with an empty array when the user has no reservations', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([[]]);

    const app = buildApp(db);
    const res = await request(app).get('/api/reservations').set('Authorization', `Bearer ${memberToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 500 when the database throws', async () => {
    const db = createMockDb();
    db.query.mockRejectedValueOnce(new Error('connection lost'));

    const app = buildApp(db);
    const res = await request(app).get('/api/reservations').set('Authorization', `Bearer ${memberToken()}`);

    expect(res.status).toBe(500);
  });
});
