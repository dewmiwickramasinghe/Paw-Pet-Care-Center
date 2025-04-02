import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "./AddUser.css";

function AddUser() {
  // State to manage form inputs
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null);  // State to handle error messages
  const { id } = useParams(); // Get user ID from URL params for editing
  const navigate = useNavigate(); // For redirecting after form submission

  // Fetch user details if id exists (for update)
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/users/${id}`)
        .then((res) => {
          if (res.data.user) {
            setInputs(res.data.user);
          }
        })
        .catch((err) => setError("Error fetching user: " + err.message));
    }
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // Form validation function
  const validateForm = () => {
    if (inputs.password !== inputs.confirmPassword) {
      setError("Passwords do not match!");
      return false;
    }
    if (!inputs.name || !inputs.email || !inputs.phoneNumber || !inputs.address || !inputs.username || !inputs.password) {
      setError("All fields are required!");
      return false;
    }
    return true;
  };

  // Handle form submission (add or update user)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error message before submitting
    setError(null);

    // Validate the form before submission
    if (!validateForm()) {
      return;
    }

    try {
      let res;
      if (id) {
        // Update user
        res = await axios.put(`http://localhost:5000/users/${id}`, inputs);
      } else {
        // Add new user
        res = await axios.post('http://localhost:5000/users', inputs);
      }

      if (res.status === 200 || res.status === 201) {
        console.log("User saved successfully:", res.data);
        // Redirect to the profile page after successful submission
        navigate(`/profile/${id || res.data.user._id}`); // Redirect to profile page (new user or updated)
      } else {
        setError("Unexpected response: " + res.statusText);
      }
    } catch (err) {
      console.error("Error saving user:", err.response ? err.response.data : err);
      setError("Error: " + (err.response ? err.response.data.message : err.message));
    }
  };

  return (
    <div className="add-user-container">
      <div className="form-box">
        <h1>{id ? 'Update User' : 'Sign Up'}</h1>
        {error && <div className="error-message">{error}</div>} {/* Display error messages */}
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
          <input
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={inputs.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          <button type="submit">{id ? 'Update User' : 'Submit'}</button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
