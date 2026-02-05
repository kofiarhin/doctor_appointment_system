import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './NavBar.styles.scss';

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="nav-bar">
      <div className="nav-brand">Doctor On Demand</div>
      <div className="nav-links">
        <Link to="/">Doctors</Link>
        <Link to="/about">About</Link>
        {user && <Link to="/appointments">Appointments</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <button className="nav-logout" type="button" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
