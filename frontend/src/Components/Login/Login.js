import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userName', data.userName);
        localStorage.setItem('userRole', data.userRole);

        if (data.userRole === 'Pet Owner') {
          navigate('/mainhome');
        } else {
          switch (data.userRole) {
            case 'Admin':
              navigate('/admindashboard');
              break;
            case 'Doctor':
              navigate('/doctordashboard');
              break;
            case 'Financial Manager':
              navigate('/financialdashboard');
              break;
            case 'Seller':
              navigate('/sellerdashboard');
              break;
            default:
              navigate('/');
          }
        }
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while logging in. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="login-background"> {/* <-- New background wrapper */}
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>

          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Pet Owner">Pet Owner</option>
            <option value="Doctor">Doctor</option>
            <option value="Financial Manager">Financial Manager</option>
            <option value="Seller">Seller</option>
            <option value="Admin">Admin</option>
          </select>

          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          {error && <div className="error-message">{error}</div>}

        </form>
      </div>
    </div>
  );
};

export default Login;
