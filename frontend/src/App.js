import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import CreateAppointment from './pages/CreateAppointment'; // ✅ NEW IMPORT
import AdminUsers from './pages/AdminUsers';
import EditAppointment from './pages/EditAppointment';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Appointments listing */}
          <Route path="/appointments" element={
            <PrivateRoute><Appointments /></PrivateRoute>
          } />

          {/* ✅ New Appointment form page */}
          <Route path="/appointments/create" element={
            <PrivateRoute><CreateAppointment /></PrivateRoute>
          } />

          {/* Edit appointment */}
          <Route path="/appointments/edit/:id" element={
            <PrivateRoute><EditAppointment /></PrivateRoute>
          } />

          {/* Admin-only users page */}
          <Route path="/admin/users" element={
            <PrivateRoute role="admin"><AdminUsers /></PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
