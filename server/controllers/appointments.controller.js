const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const listAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id }).populate(
      'doctorId'
    );
    const response = appointments.map((appointment) => ({
      id: appointment._id.toString(),
      datetime: appointment.datetime.toISOString(),
      status: appointment.status,
      notes: appointment.notes,
      doctor: appointment.doctorId
    }));
    res.status(200).json({ appointments: response });
  } catch (error) {
    next(error);
  }
};

const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, datetime, notes } = req.body;
    if (!doctorId || !datetime) {
      return res.status(400).json({ error: { message: 'Doctor and datetime are required' } });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: { message: 'Doctor not found' } });
    }
    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      datetime: new Date(datetime),
      notes: notes || ''
    });
    res.status(201).json({
      appointment: {
        id: appointment._id.toString(),
        datetime: appointment.datetime.toISOString(),
        status: appointment.status,
        notes: appointment.notes,
        doctor: doctorId
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const { datetime, status } = req.body;
    if (!datetime && !status) {
      return res.status(400).json({ error: { message: 'Update requires datetime or status' } });
    }
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.user._id
    });
    if (!appointment) {
      return res.status(404).json({ error: { message: 'Appointment not found' } });
    }
    if (datetime) {
      appointment.datetime = new Date(datetime);
    }
    if (status) {
      appointment.status = status;
    }
    await appointment.save();
    res.status(200).json({
      appointment: {
        id: appointment._id.toString(),
        datetime: appointment.datetime.toISOString(),
        status: appointment.status,
        notes: appointment.notes,
        doctor: appointment.doctorId
      }
    });
  } catch (error) {
    next(error);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.user._id
    });
    if (!appointment) {
      return res.status(404).json({ error: { message: 'Appointment not found' } });
    }
    appointment.status = 'cancelled';
    await appointment.save();
    res.status(200).json({ message: 'Appointment cancelled' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listAppointments, createAppointment, updateAppointment, cancelAppointment };
