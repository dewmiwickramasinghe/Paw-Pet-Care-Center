import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdatePet.css'; // Updated to a unique CSS file for this page

function UpdatePet() {
  const { id, userId } = useParams(); // Get pet ID and user ID from URL
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    petname: '',
    pettype: '',
    age: '',
    gender: '',
    breed: '',
    colour: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pet details and pre-fill form
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/pets/${id}`);
        setInputs(response.data);
      } catch (err) {
        setError('Failed to fetch pet details.');
        console.error(err);
      }
    };
    fetchPet();
  }, [id]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs.petname || !inputs.pettype || !inputs.age || !inputs.gender || !inputs.breed || !inputs.colour) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.put(`http://localhost:5000/pets/${id}`, inputs);
      if (res.status === 200) {
        navigate(`/pet-profile/${id}`); // Redirect to pet profile after update
      } else {
        setError('Unexpected error while updating pet.');
      }
    } catch (err) {
      setError('Error updating pet data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await axios.delete(`http://localhost:5000/pets/${id}`);
        if (userId) {
          navigate(`/mypet/${userId}`); // Redirect to user's pet list after deletion
        } else {
          navigate('/'); // fallback if userId is undefined
        }
      } catch (err) {
        setError('Failed to delete the pet.');
        console.error(err);
      }
    }
  };

  return (
    <div className="update-pet-page">
      <div className="update-pet-container">
        <form onSubmit={handleSubmit} className="update-pet-form">
          <h1>Update Pet</h1>

          <label>Pet's Name</label>
          <input type="text" name="petname" value={inputs.petname} onChange={handleChange} required />

          <label>Pet Type</label>
          <select name="pettype" value={inputs.pettype} onChange={handleChange} required>
            <option value="">Select Pet Type</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </select>

          <label>Age</label>
          <input type="text" name="age" value={inputs.age} onChange={handleChange} required />

          <label>Gender</label>
          <div className="gender-container">
            <label>
              <input type="radio" name="gender" value="Male" checked={inputs.gender === 'Male'} onChange={handleChange} />
              Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" checked={inputs.gender === 'Female'} onChange={handleChange} />
              Female
            </label>
          </div>

          <label>Breed</label>
          <input type="text" name="breed" value={inputs.breed} onChange={handleChange} required />

          <label>Colour</label>
          <input type="text" name="colour" value={inputs.colour} onChange={handleChange} required />

          {error && <p className="error-message">{error}</p>}

          <div className="button-group">
            <button type="submit" className="update-button" disabled={loading}>
              {loading ? 'Updating...' : 'Update Pet'}
            </button>

            <button type="button" className="delete-button" onClick={handleDelete}>
              Delete Pet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePet;
