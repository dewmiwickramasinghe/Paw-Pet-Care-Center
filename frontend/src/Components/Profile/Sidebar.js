import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'hidden'}`}>
        <h2>Menu</h2>
        <Link to="/add-pet">➕ Add Pet</Link>
        <Link to={`/my-pets/${localStorage.getItem('userId')}`}>🐾 My Pets</Link>

        {/* Link + onClick together */}
        <Link to="/" onClick={handleLogout}>🚪 Logout</Link> {/* 👈 */}
      </div>

      <div className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </div>
    </>
  );
}

export default Sidebar;
