// ProfileIcon.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileIcon = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // If no userId, redirect to login
  if (!userId) {
    navigate('/addpet');
    return null;
  }

  // Handle the profile icon click
  const handleProfileClick = () => {
    navigate('/profile');  // Navigate to the profile page
  };

  return (
    <div className="profile-icon" onClick={handleProfileClick}>
      <img src="profile-icon.png" alt="Profile" />
    </div>
  );
};

export default ProfileIcon;
