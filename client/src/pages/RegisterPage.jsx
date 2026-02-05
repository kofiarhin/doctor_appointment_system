import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './RegisterPage.styles.scss';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, registerStatus } = useAuth();
  const [formState, setFormState] = useState({ name: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      await register(formState);
      navigate('/appointments');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <section className="register-page">
      <h1>Create account</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formState.password}
          onChange={handleChange}
          required
        />
        {errorMessage && <p className="form-error">{errorMessage}</p>}
        <button type="submit" disabled={registerStatus === 'pending'}>
          Create account
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
};

export default RegisterPage;
