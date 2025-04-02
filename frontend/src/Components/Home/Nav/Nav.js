import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';  // Import FontAwesome

function Nav() {
  return (
    <nav className="navbar">
      {/* Navigation Links */}
      <ul className="navbar-links">
        <li>
          <Link to="/mainhome" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/userdetails" className="nav-link">User List</Link>
        </li>
        <li>
          <Link to="/addpet" className="nav-link">Add Pet</Link>
        </li>
        <li>
          <Link to="/pets" className="nav-link">Pet List</Link>
        </li>
        
        {/* Login Button Link */}
        <li>
          <Link to="/login">
            <button className="nav-button">Login</button>
          </Link>
        </li>

        {/* Sign Up Button Link */}
        <li>
          <Link to="/adduser">
            <button className="nav-button">Sign Up</button>
          </Link>
        </li>

        {/* Profile Icon */}
        <li>
          <Link to="/profile" className="nav-link">
            <i className="fa fa-user" aria-hidden="true"></i> {/* Profile Icon */}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
