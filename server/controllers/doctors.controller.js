const Doctor = require('../models/Doctor');

const listDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email role');
    const response = doctors.map((doctor) => ({
      id: doctor._id.toString(),
      user: doctor.userId,
      specialty: doctor.specialty,
      bio: doctor.bio,
      availability: doctor.availability
    }));
    res.status(200).json({ doctors: response });
  } catch (error) {
    next(error);
  }
};

const getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email role');
    if (!doctor) {
      return res.status(404).json({ error: { message: 'Doctor not found' } });
    }
    return res.status(200).json({
      doctor: {
        id: doctor._id.toString(),
        user: doctor.userId,
        specialty: doctor.specialty,
        bio: doctor.bio,
        availability: doctor.availability
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listDoctors, getDoctor };
