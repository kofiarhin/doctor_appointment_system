import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.styles.scss';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginStatus } = useAuth();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      await login(formState);
      navigate('/appointments');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <section className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loginStatus === 'pending'}>
          Sign in
        </button>
      </form>
      <p>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
};

export default LoginPage;
