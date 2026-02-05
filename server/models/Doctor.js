const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    slots: [{ type: String, required: true }]
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialty: { type: String, required: true },
    bio: { type: String, required: true },
    availability: { type: [availabilitySchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
