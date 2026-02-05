import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import AboutPage from './pages/AboutPage';
import AppointmentsPage from './pages/AppointmentsPage';
import BookPage from './pages/BookPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorsPage from './pages/DoctorsPage';

const App = () => (
  <div className="app-shell">
    <NavBar />
    <main className="app-content">
      <Routes>
        <Route path="/" element={<DoctorsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:doctorId"
          element={
            <ProtectedRoute>
              <BookPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </div>
);

export default App;
