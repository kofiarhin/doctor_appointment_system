const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    datetime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'completed'],
      default: 'scheduled'
    },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

appointmentSchema.index({ patientId: 1, datetime: -1 });
appointmentSchema.index({ doctorId: 1, datetime: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
