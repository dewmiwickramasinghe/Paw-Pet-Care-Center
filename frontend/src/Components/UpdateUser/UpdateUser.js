import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateUser.css';

function UpdateUser() {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    username: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // 🐾 Add background only for this page
  useEffect(() => {
    document.body.classList.add('update-user-background');
    return () => {
      document.body.classList.remove('update-user-background');
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        if (response.data.user) {
          setInputs({
            name: response.data.user.name || '',
            email: response.data.user.email || '',
            phoneNumber: response.data.user.phoneNumber || '',
            address: response.data.user.address || '',
            username: response.data.user.username || ''
          });
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Error fetching user data');
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/users/${id}`, inputs);
      if (response.status >= 200 && response.status < 300) {
        alert('User updated successfully');
        navigate('/');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Error updating user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        navigate('/');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Error deleting user');
      }
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="update-user-container">
      <div className="form-box">
        <h1>Update Profile</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="address"
            value={inputs.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            value={inputs.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
          <input
            type="text"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />

          <div className="button-group">
            <button type="submit" className="update-user-button" disabled={loading}>
              {loading ? 'Updating...' : 'Update User'}
            </button>
            <br />
            <button type="button" className="delete-user-button" onClick={handleDelete}>
              Delete User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
