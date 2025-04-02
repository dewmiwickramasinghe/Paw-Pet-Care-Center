import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css'; // You can reuse the same styles here.

function UpdateProfile() {
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    username: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user details for editing
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        setInputs(response.data);
      } catch (err) {
        setError('Failed to fetch user details for editing.');
        console.error(err);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.put(`http://localhost:5000/users/${id}`, inputs);
      if (res.status === 200) {
        navigate(`/profile/${id}`); // Redirect back to the profile page after successful update
      } else {
        setError('Unexpected error while updating profile.');
      }
    } catch (err) {
      setError('Error updating user data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-container">
      <form onSubmit={handleSubmit} className="add-user-form">
        <h1>Update Profile</h1>

        <label>Name</label>
        <input type="text" name="name" value={inputs.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={inputs.email} onChange={handleChange} required />

        <label>Phone Number</label>
        <input type="text" name="phoneNumber" value={inputs.phoneNumber} onChange={handleChange} required />

        <label>Address</label>
        <input type="text" name="address" value={inputs.address} onChange={handleChange} required />

        <label>Username</label>
        <input type="text" name="username" value={inputs.username} onChange={handleChange} required />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default UpdateProfile;
