import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDoctor } from '../hooks/useDoctors';
import { useAppointments } from '../hooks/useAppointments';
import './BookPage.styles.scss';

const BookPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useDoctor(doctorId);
  const { createAppointment } = useAppointments();
  const [datetime, setDatetime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await createAppointment({ doctorId, datetime });
      setMessage('Appointment booked.');
      navigate('/appointments');
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (isLoading) {
    return <div className="loading-state">Loading doctor...</div>;
  }

  if (error) {
    return <div className="error-state">Unable to load doctor.</div>;
  }

  return (
    <section className="book-page">
      <h1>Book appointment with {data?.doctor?.user?.name}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="datetime">Preferred date & time</label>
        <input
          id="datetime"
          type="datetime-local"
          value={datetime}
          onChange={(event) => setDatetime(event.target.value)}
          required
        />
        {message && <p className="form-message">{message}</p>}
        <button type="submit">Confirm</button>
      </form>
    </section>
  );
};

export default BookPage;
