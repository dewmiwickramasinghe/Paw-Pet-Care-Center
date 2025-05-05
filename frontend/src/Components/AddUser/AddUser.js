import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "./AddUser.css";

function AddUser() {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      let res;
      if (id) {
        res = await axios.put(`http://localhost:5000/users/${id}`, inputs);
      } else {
        res = await axios.post('http://localhost:5000/users', inputs);
      }

      if (res.status === 200 || res.status === 201) {
        console.log("User saved successfully:", res.data);
        navigate('/mainhome'); // 👉 Redirect to Home page after submit
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
        {error && <div className="error-message">{error}</div>}
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
          <button className = "Submit-btn" type="submit">{id ? 'Update User' : 'Submit'}</button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
