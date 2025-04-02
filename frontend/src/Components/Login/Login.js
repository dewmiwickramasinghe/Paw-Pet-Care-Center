import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the login logic (authentication)
    console.log('Logging in as:', role);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="role">Select Role:</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="petowner">Pet Owner</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
        </select>

        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">Login</button>
        <a href="/forgot-password">Forgot Password?</a>
      </form>
    </div>
  );
};

export default Login;
