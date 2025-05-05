import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';  // Import FontAwesome

function Nav() {
  // Get user details from localStorage
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('userName');

  // Profile link setup
  const profileLink = userId ? `/userdetails/${userId}` : '/login';



  return (
    <nav className="navbar">
      {/* Navigation Links */}
      <ul className="navbar-links">
        <li>
          <Link to="/mainhome" className="nav-link">Home</Link>
        </li>
      
       
        
      </ul>

      {/* Right side buttons (Login, Signup, Profile) */}
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
            {username && <span className="username-text">{`Hi, ${username}`}</span>} {/* Corrected this part */}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
