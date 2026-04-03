import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import User from '../src/models/User.js';
import FinancialRecord from '../src/models/FinancialRecord.js';

const API = '/api/v1';

// Shared state for the test runner
let viewerToken;
let adminToken;
let testRecordId;


beforeAll(async () => {
  // Connect to a TEST database, not your real one!
  await mongoose.connect(process.env.MONGODB_URI + '_test');
  await User.deleteMany();
  await FinancialRecord.deleteMany();

  // Seed a verified Admin and a Viewer
  await User.create([
    { name: 'Admin User', email: 'admin@test.com', password: 'Password1!', role: 'admin', isVerified: true },
    { name: 'Viewer User', email: 'viewer@test.com', password: 'Password1!', role: 'viewer', isVerified: true }
  ]);
});

afterAll(async () => {
  // Clean up and close connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});


describe('Authentication API', () => {
  it('POST /auth/register - Initiates registration and sends OTP', async () => {
    const res = await request(app).post(`${API}/auth/register`).send({
      name: 'New User', email: 'new@test.com', password: 'Password1!'
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Registration initiated/);
  });

  it('POST /auth/register - Rejects weak passwords (Validation)', async () => {
    const res = await request(app).post(`${API}/auth/register`).send({
      name: 'Bad Pass', email: 'badpass@test.com', password: '123'
    });
    expect(res.status).toBe(422);
    expect(res.body.errors[0]).toHaveProperty('path', 'password');
  });

  it('POST /auth/login - Logs in Admin and sets secure cookies', async () => {
    const res = await request(app).post(`${API}/auth/login`).send({
      email: 'admin@test.com', password: 'Password1!'
    });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    
    
    const cookies = res.headers['set-cookie'][0];
    expect(cookies).toMatch(/jwt=/);
    expect(cookies).toMatch(/HttpOnly/);
    
    adminToken = res.body.data.accessToken; 
  });

  it('POST /auth/login - Logs in Viewer', async () => {
    const res = await request(app).post(`${API}/auth/login`).send({
      email: 'viewer@test.com', password: 'Password1!'
    });
    viewerToken = res.body.data.accessToken;
  });
});


 // FINANCIAL RECORDS TESTS (CRUD)

describe('Financial Records API', () => {
  it('POST /records - Fails without a token (401 Unauthorized)', async () => {
    const res = await request(app).post(`${API}/records`).send({
      amount: 100, type: 'income', category: 'Salary', date: '2023-10-01'
    });
    expect(res.status).toBe(401);
  });

  it('POST /records - Allows Admin to create a record', async () => {
    const res = await request(app)
      .post(`${API}/records`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5000, type: 'income', category: 'Salary', date: '2023-10-01' });
    
    expect(res.status).toBe(201);
    expect(res.body.data.amount).toBe(5000);
    testRecordId = res.body.data._id; // Save ID for update/delete tests
  });

  it('GET /records - Retrieves paginated records', async () => {
    const res = await request(app)
      .get(`${API}/records?type=income`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.records).toBeInstanceOf(Array);
    expect(res.body.data.total).toBe(1);
  });
});

//  ROLE-BASED ACCESS CONTROL (RBAC) TESTS
 
describe('Security & RBAC Enforcement', () => {
  it('PUT /records/:id - Blocks Viewers from updating records (403 Forbidden)', async () => {
    const res = await request(app)
      .put(`${API}/records/${testRecordId}`)
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ amount: 9999 });
    
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Insufficient permissions/);
  });

  it('GET /dashboard/summary - Blocks Viewers from Dashboard', async () => {
    const res = await request(app)
      .get(`${API}/dashboard/summary`)
      .set('Authorization', `Bearer ${viewerToken}`);
    
    expect(res.status).toBe(403);
  });

  it('GET /users - Allows Admin to view user list', async () => {
    const res = await request(app)
      .get(`${API}/users`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.users.length).toBeGreaterThan(0);
  });
});