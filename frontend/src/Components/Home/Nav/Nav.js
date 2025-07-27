import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import logo from '../Nav/b.png'; // Update this path as needed

function Nav() {
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('userName');
  const profileLink = userId ? `/userdetails/${userId}` : '/login';

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/mainhome">
          <img src={logo} alt="Paw Pet Care" className="logo-img" />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="navbar-links">
        <li>
          <Link to="/mainhome" className="nav-link">Home</Link>
        </li>
      </ul>

      {/* Right side buttons */}
      <div className="profile-section">
        <ul className="navbar-links">
          <li>
            <Link to="/login" className="nav-link">Login</Link>
          </li>
          <li>
            <Link to="/adduser" className="nav-link">Sign Up</Link>
          </li>
          <li className="profile-link">
            <Link to={profileLink} className="nav-link">
              <i className="fa fa-user" aria-hidden="true"></i>
            </Link>
            {username && <span className="username-text">{`Hi, ${username}`}</span>}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
