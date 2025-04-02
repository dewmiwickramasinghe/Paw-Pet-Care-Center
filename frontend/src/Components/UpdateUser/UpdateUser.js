import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateUser() {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    username: ''
  });

  // Get the user ID from the URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the user data when the component mounts
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/users/${id}`)
        .then((res) => {
          if (res.data.user) {
            setInputs({
              name: res.data.user.name || '',
              email: res.data.user.email || '',
              phoneNumber: res.data.user.phoneNumber || '',
              address: res.data.user.address || '',
              username: res.data.user.username || ''
            });
          }
        })
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // Handle form submission (for updating user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.put(`http://localhost:5000/users/${id}`, inputs);
      
      if (res.status >= 200 && res.status < 300) {
        navigate('/');  // Redirect back to the user list page after update
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // Handle delete button click
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        navigate('/');  // Redirect to the user list after deletion
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  return (
    <div className="add-user-container">
      <div className="form-box">
        <h1>Pet Owner Profile</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={inputs.name || ''}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={inputs.email || ''}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="address"
            value={inputs.address || ''}
            onChange={handleChange}
            placeholder="Address"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            value={inputs.phoneNumber || ''}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
          <input
            type="text"
            name="username"
            value={inputs.username || ''}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <button type="submit">Update User</button>
        </form>

        {/* Delete button */}
        <button onClick={handleDelete} className="delete-button">
          Delete User
        </button>
      </div>
    </div>
  );
}

export default UpdateUser;
