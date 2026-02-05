const express = require('express');
const {
  listAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment
} = require('../controllers/appointments.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, listAppointments);
router.post('/', authMiddleware, createAppointment);
router.put('/:id', authMiddleware, updateAppointment);
router.post('/:id/cancel', authMiddleware, cancelAppointment);

module.exports = router;
