import React from 'react';
import { useAppointments } from '../hooks/useAppointments';
import './AppointmentsPage.styles.scss';

const AppointmentsPage = () => {
  const { data, isLoading, error, cancelAppointment } = useAppointments();

  if (isLoading) {
    return <div className="loading-state">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error-state">Unable to load appointments.</div>;
  }

  return (
    <section className="appointments-page">
      <h1>Your appointments</h1>
      <div className="appointments-list">
        {data?.appointments?.map((appointment) => (
          <article className="appointment-card" key={appointment.id}>
            <h2>{appointment.doctor?.specialty}</h2>
            <p>{new Date(appointment.datetime).toLocaleString()}</p>
            <p>Status: {appointment.status}</p>
            {appointment.status === 'scheduled' && (
              <button type="button" onClick={() => cancelAppointment(appointment.id)}>
                Cancel
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default AppointmentsPage;
