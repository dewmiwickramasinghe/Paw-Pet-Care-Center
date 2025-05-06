import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Profile.css';

function Profile() {
  const { userId } = useParams();  // Get userId from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user details for editing.', error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleUpdateRedirect = () => {
    navigate(`/update-user/${userId}`);  // Redirect to the update user page
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/users/${userId}`);
        alert('Your account has been deleted.');
        navigate('/');  // Redirect to the homepage or login page after successful deletion
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-background">
      <div className="profile-container">
        <div className="profile-content">
          <h1>Profile</h1>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Username:</strong> {user.username}</p>

          {/* Update and Delete User Buttons */}
          <div className="profile-buttons">
            <button className="update-button" onClick={handleUpdateRedirect}>Update User</button>
            <button className="delete-button" onClick={handleDeleteUser}>Delete User</button>
          </div>
        </div>

        <div className="profile-sidebar">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default Profile;
