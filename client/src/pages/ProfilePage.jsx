import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import './ProfilePage.styles.scss';

const ProfilePage = () => {
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await updateProfile({ name });
      setMessage('Profile updated.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="profile-page">
      <h1>Profile</h1>
      <p>Email: {user?.email}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        {message && <p className="form-message">{message}</p>}
        <button type="submit">Save</button>
      </form>
    </section>
  );
};

export default ProfilePage;
