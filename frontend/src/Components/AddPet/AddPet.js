import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Addpet.css'; // Ensure this CSS file matches your design

function AddPet() {
  const [inputs, setInputs] = useState({
    petname: '',
    pettype: '',
    age: '',
    gender: '',
    breed: '',
    colour: '',
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const { id } = useParams(); // Getting pet id from URL (if editing)
  const navigate = useNavigate();

  // Fetch existing pet data if we're in edit mode
  useEffect(() => {
    if (id) {
      const fetchPet = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/pets/${id}`);
          setInputs(response.data); // Set the fetched pet data in the state
        } catch (err) {
          setError('Failed to fetch pet details');
          console.error(err);
        }
      };
      fetchPet();
    }
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
      let res;
      if (id) {
        res = await axios.put(`http://localhost:5000/pets/${id}`, inputs);
      } else {
        res = await axios.post('http://localhost:5000/pets', inputs);
      }

      if (res.status === 201 || res.status === 200) {
        navigate('/pets'); // Redirect to pet list page after success
      } else {
        setError('Unexpected error occurred while saving pet.');
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error saving pet data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await axios.delete(`http://localhost:5000/pets/${id}`);
        navigate('/pets'); // Redirect to pet list page after deletion
      } catch (err) {
        setError('Failed to delete pet');
        console.error(err);
      }
    }
  };

  return (
    <div className="add-pet-container">
      <form onSubmit={handleSubmit} className="add-pet-form">
        <h1>{id ? 'Update Pet' : 'Add Pet'}</h1>

        <label>Pet's Name</label>
        <input type="text" name="petname" value={inputs.petname} onChange={handleChange} placeholder="Pet Name" required />

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
        <input type="text" name="age" value={inputs.age} onChange={handleChange} placeholder="Age (e.g., 2 years)" required />

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
        <input type="text" name="breed" value={inputs.breed} onChange={handleChange} placeholder="Breed" required />

        <label>Colour</label>
        <input type="text" name="colour" value={inputs.colour} onChange={handleChange} placeholder="Colour" required />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>{loading ? 'Saving...' : id ? 'Update Pet' : 'Add Pet'}</button>
      </form>

      {id && <button className="delete-btn" onClick={handleDelete}>Delete Pet</button>}
    </div>
  );
}

export default AddPet;
