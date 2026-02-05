const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const doctorRoutes = require('./routes/doctors.routes');
const appointmentRoutes = require('./routes/appointments.routes');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:4000',
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
