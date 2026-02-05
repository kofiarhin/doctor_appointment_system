const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

describe('models', () => {
  it('hashes and compares password', async () => {
    const passwordHash = await User.hashPassword('Password123!');
    const user = new User({
      name: 'Test',
      email: 'test@example.com',
      passwordHash
    });
    const match = await user.comparePassword('Password123!');
    expect(match).toBe(true);
  });

  it('requires doctor fields', () => {
    const doctor = new Doctor({});
    const error = doctor.validateSync();
    expect(error.errors.userId).toBeDefined();
    expect(error.errors.specialty).toBeDefined();
    expect(error.errors.bio).toBeDefined();
  });

  it('defaults appointment status', () => {
    const appointment = new Appointment({
      patientId: new mongoose.Types.ObjectId(),
      doctorId: new mongoose.Types.ObjectId(),
      datetime: new Date()
    });
    expect(appointment.status).toBe('scheduled');
  });
});
