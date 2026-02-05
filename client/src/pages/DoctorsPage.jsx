import React from 'react';
import { Link } from 'react-router-dom';
import { useDoctors } from '../hooks/useDoctors';
import './DoctorsPage.styles.scss';

const DoctorsPage = () => {
  const { data, isLoading, error } = useDoctors();

  if (isLoading) {
    return <div className="loading-state">Loading doctors...</div>;
  }

  if (error) {
    return <div className="error-state">Unable to load doctors.</div>;
  }

  return (
    <section className="doctors-page">
      <h1>Available Doctors</h1>
      <div className="doctor-grid">
        {data?.doctors?.map((doctor) => (
          <article className="doctor-card" key={doctor.id}>
            <h2>{doctor.user?.name}</h2>
            <p>{doctor.specialty}</p>
            <p>{doctor.bio}</p>
            <Link to={`/book/${doctor.id}`}>Book appointment</Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DoctorsPage;
