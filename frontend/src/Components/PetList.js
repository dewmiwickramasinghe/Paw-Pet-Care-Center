import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './PetList.css';

function PetList() {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pets');
        setPets(response.data); // Set the fetched pet data
      } catch (err) {
        setError('Failed to fetch pets');
        console.error(err);
      }
    };

    fetchPets();

    // Redirect to home page when browser back button is pressed
    const handlePopState = () => {
      navigate('/', { replace: true }); // Redirect to home page
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // Delete a pet
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await axios.delete(`http://localhost:5000/pets/${id}`);
        setPets(pets.filter((pet) => pet._id !== id)); // Remove deleted pet from state
      } catch (err) {
        setError('Failed to delete pet');
        console.error(err);
      }
    }
  };

  return (
    <div className="pet-list-container">
      <h1>Pet List</h1>
      {error && <p className="error-message">{error}</p>}
      <table className="pet-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Breed</th>
            <th>Colour</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pets.length === 0 ? (
            <tr>
              <td colSpan="7">No pets available</td>
            </tr>
          ) : (
            pets.map((pet) => (
              <tr key={pet._id}>
                <td>{pet.petname}</td>
                <td>{pet.pettype}</td>
                <td>{pet.age}</td>
                <td>{pet.gender}</td>
                <td>{pet.breed}</td>
                <td>{pet.colour}</td>
                <td className="action-buttons">
                  {/* Update Button */}
                  <Link to={`/addpet/${pet._id}`}>
                    <button className="update-btn">Update</button>
                  </Link>

                  {/* Delete Button */}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(pet._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PetList;
