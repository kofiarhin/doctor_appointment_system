const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { createToken } = require('../controllers/auth.controller');

let mongoServer;

const createUser = async (role = 'patient') => {
  const passwordHash = await User.hashPassword('Password123!');
  return User.create({
    name: 'Test User',
    email: `${role}@example.com`,
    passwordHash,
    role
  });
};

const loginCookie = (user) => {
  const token = createToken(user._id);
  return `token=${token}`;
};

describe('API', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
  });

  it('returns health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('registers a user', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'Password123!'
    });
    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('alice@example.com');
  });

  it('rejects duplicate registration', async () => {
    await createUser();
    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'patient@example.com',
      password: 'Password123!'
    });
    expect(response.status).toBe(400);
  });

  it('validates register payload', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'missing@example.com'
    });
    expect(response.status).toBe(400);
  });

  it('logs in a user', async () => {
    await createUser();
    const response = await request(app).post('/api/auth/login').send({
      email: 'patient@example.com',
      password: 'Password123!'
    });
    expect(response.status).toBe(200);
    expect(response.headers['set-cookie'][0]).toContain('token=');
  });

  it('rejects invalid login', async () => {
    await createUser();
    const response = await request(app).post('/api/auth/login').send({
      email: 'patient@example.com',
      password: 'WrongPassword'
    });
    expect(response.status).toBe(401);
  });

  it('validates login payload', async () => {
    const response = await request(app).post('/api/auth/login').send({});
    expect(response.status).toBe(400);
  });

  it('returns current user', async () => {
    const user = await createUser();
    const response = await request(app)
      .get('/api/auth/me')
      .set('Cookie', loginCookie(user));
    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(user.email);
  });

  it('rejects unauthorized me', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.status).toBe(401);
  });

  it('logs out user', async () => {
    const response = await request(app).post('/api/auth/logout');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logged out');
  });

  it('updates user profile', async () => {
    const user = await createUser();
    const response = await request(app)
      .put('/api/users/profile')
      .set('Cookie', loginCookie(user))
      .send({ name: 'Updated Name' });
    expect(response.status).toBe(200);
    expect(response.body.user.name).toBe('Updated Name');
  });

  it('validates profile update', async () => {
    const user = await createUser();
    const response = await request(app)
      .put('/api/users/profile')
      .set('Cookie', loginCookie(user))
      .send({});
    expect(response.status).toBe(400);
  });

  it('lists doctors and gets doctor detail', async () => {
    const doctorUser = await createUser('doctor');
    const doctor = await Doctor.create({
      userId: doctorUser._id,
      specialty: 'Cardiology',
      bio: 'Heart specialist',
      availability: [{ day: 'Monday', slots: ['09:00'] }]
    });

    const listResponse = await request(app).get('/api/doctors');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.doctors).toHaveLength(1);

    const detailResponse = await request(app).get(`/api/doctors/${doctor._id}`);
    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.doctor.specialty).toBe('Cardiology');
  });

  it('handles doctor not found', async () => {
    const response = await request(app).get(`/api/doctors/${new mongoose.Types.ObjectId()}`);
    expect(response.status).toBe(404);
  });

  it('creates and lists appointments', async () => {
    const patient = await createUser();
    const doctorUser = await createUser('doctor');
    const doctor = await Doctor.create({
      userId: doctorUser._id,
      specialty: 'Dermatology',
      bio: 'Skin specialist'
    });
    const createResponse = await request(app)
      .post('/api/appointments')
      .set('Cookie', loginCookie(patient))
      .send({ doctorId: doctor._id.toString(), datetime: '2030-01-01T09:00:00.000Z' });
    expect(createResponse.status).toBe(201);

    const listResponse = await request(app)
      .get('/api/appointments')
      .set('Cookie', loginCookie(patient));
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.appointments).toHaveLength(1);
  });

  it('validates appointment creation', async () => {
    const patient = await createUser();
    const response = await request(app)
      .post('/api/appointments')
      .set('Cookie', loginCookie(patient))
      .send({});
    expect(response.status).toBe(400);
  });

  it('handles appointment doctor not found', async () => {
    const patient = await createUser();
    const response = await request(app)
      .post('/api/appointments')
      .set('Cookie', loginCookie(patient))
      .send({ doctorId: new mongoose.Types.ObjectId().toString(), datetime: '2030-01-01T09:00:00.000Z' });
    expect(response.status).toBe(404);
  });

  it('updates and cancels appointment', async () => {
    const patient = await createUser();
    const doctorUser = await createUser('doctor');
    const doctor = await Doctor.create({
      userId: doctorUser._id,
      specialty: 'Neurology',
      bio: 'Brain specialist'
    });
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      datetime: new Date('2030-01-01T09:00:00.000Z')
    });

    const updateResponse = await request(app)
      .put(`/api/appointments/${appointment._id}`)
      .set('Cookie', loginCookie(patient))
      .send({ status: 'completed' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.appointment.status).toBe('completed');

    const cancelResponse = await request(app)
      .post(`/api/appointments/${appointment._id}/cancel`)
      .set('Cookie', loginCookie(patient));
    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.message).toBe('Appointment cancelled');
  });

  it('validates appointment update payload', async () => {
    const patient = await createUser();
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: new mongoose.Types.ObjectId(),
      datetime: new Date('2030-01-01T09:00:00.000Z')
    });
    const response = await request(app)
      .put(`/api/appointments/${appointment._id}`)
      .set('Cookie', loginCookie(patient))
      .send({});
    expect(response.status).toBe(400);
  });

  it('returns appointment not found on update', async () => {
    const patient = await createUser();
    const response = await request(app)
      .put(`/api/appointments/${new mongoose.Types.ObjectId()}`)
      .set('Cookie', loginCookie(patient))
      .send({ status: 'cancelled' });
    expect(response.status).toBe(404);
  });

  it('returns appointment not found on cancel', async () => {
    const patient = await createUser();
    const response = await request(app)
      .post(`/api/appointments/${new mongoose.Types.ObjectId()}/cancel`)
      .set('Cookie', loginCookie(patient));
    expect(response.status).toBe(404);
  });

  it('returns 404 on unknown route', async () => {
    const response = await request(app).get('/api/unknown');
    expect(response.status).toBe(404);
  });

  it('updates appointment datetime', async () => {
    const patient = await createUser();
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: new mongoose.Types.ObjectId(),
      datetime: new Date('2030-01-01T09:00:00.000Z')
    });

    const response = await request(app)
      .put(`/api/appointments/${appointment._id}`)
      .set('Cookie', loginCookie(patient))
      .send({ datetime: '2030-01-02T10:00:00.000Z' });
    expect(response.status).toBe(200);
    expect(response.body.appointment.datetime).toBe('2030-01-02T10:00:00.000Z');
  });
});
