const jwt = require('jsonwebtoken');
const request = require('supertest');
const { buildApp, createMockDb } = require('../helpers/app');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

const adminToken = () => signToken({ id: 99, email: 'admin@nightfall.com', is_admin: true });
const memberToken = () => signToken({ id: 1, email: 'user1@nightfall.com', is_admin: false });

describe('GET /api/users', () => {
  it('returns 401 when no token is provided', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app).get('/api/users');

    expect(res.status).toBe(401);
  });

  it('returns 403 when the caller is not an admin', async () => {
    const app = buildApp(createMockDb());

    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${memberToken()}`);

    expect(res.status).toBe(403);
  });

  it('returns users without reservations as an empty array', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([
      [
        {
          user_id: 1,
          email: 'user1@nightfall.com',
          is_admin: 0,
          user_created_at: '2026-01-01T00:00:00.000Z',
          reservation_id: null,
          date_time: null,
          participants: null,
          reservation_created_at: null,
          experience_id: null,
          experience_name: null,
          experience_category: null,
          experience_duration: null,
          experience_price: null,
        },
      ],
    ]);

    const app = buildApp(db);
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 1,
        email: 'user1@nightfall.com',
        is_admin: 0,
        created_at: '2026-01-01T00:00:00.000Z',
        reservations: [],
      },
    ]);
  });

  it('nests each reservation (with its experience) under the owning user', async () => {
    const db = createMockDb();
    db.query.mockResolvedValueOnce([
      [
        {
          user_id: 1,
          email: 'user1@nightfall.com',
          is_admin: 0,
          user_created_at: '2026-01-01T00:00:00.000Z',
          reservation_id: 10,
          date_time: '2026-03-01T20:00:00.000Z',
          participants: 2,
          reservation_created_at: '2026-02-01T00:00:00.000Z',
          experience_id: 5,
          experience_name: 'Bunker abandonné',
          experience_category: 'Survie',
          experience_duration: 75,
          experience_price: '50.00',
        },
        {
          user_id: 1,
          email: 'user1@nightfall.com',
          is_admin: 0,
          user_created_at: '2026-01-01T00:00:00.000Z',
          reservation_id: 11,
          date_time: '2026-04-01T20:00:00.000Z',
          participants: 1,
          reservation_created_at: '2026-02-02T00:00:00.000Z',
          experience_id: 6,
          experience_name: 'Zone radioactive',
          experience_category: 'Survie',
          experience_duration: 90,
          experience_price: '55.00',
        },
        {
          user_id: 2,
          email: 'user2@nightfall.com',
          is_admin: 0,
          user_created_at: '2026-01-02T00:00:00.000Z',
          reservation_id: null,
          date_time: null,
          participants: null,
          reservation_created_at: null,
          experience_id: null,
          experience_name: null,
          experience_category: null,
          experience_duration: null,
          experience_price: null,
        },
      ],
    ]);

    const app = buildApp(db);
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);

    const [user1, user2] = res.body;
    expect(user1.id).toBe(1);
    expect(user1.reservations).toHaveLength(2);
    expect(user1.reservations[0]).toEqual({
      id: 10,
      date_time: '2026-03-01T20:00:00.000Z',
      participants: 2,
      created_at: '2026-02-01T00:00:00.000Z',
      experience: {
        id: 5,
        name: 'Bunker abandonné',
        category: 'Survie',
        duration: 75,
        price: '50.00',
      },
    });

    expect(user2.id).toBe(2);
    expect(user2.reservations).toEqual([]);
  });

  it('returns 500 when the database throws', async () => {
    const db = createMockDb();
    db.query.mockRejectedValueOnce(new Error('connection lost'));

    const app = buildApp(db);
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(500);
  });
});
