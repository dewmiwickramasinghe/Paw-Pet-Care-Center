import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pets.css'; // Optional, for custom styles

function PetDetails() {
  const { id } = useParams(); // Retrieve the pet ID from the URL
  const navigate = useNavigate(); // To navigate after updating or deleting
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        // Adjust URL to use the pet ID
        const response = await axios.get(`http://localhost:5000/petDetails/${id}`);
        console.log('Pet Details:', response.data);
        setPet(response.data); // Set the fetched pet data to the state
      } catch (error) {
        // Detailed error handling
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          setError('Failed to fetch pet details');
        } else if (error.request) {
          console.error('Error request:', error.request);
          setError('No response from the server');
        } else {
          console.error('Error message:', error.message);
          setError('An error occurred while fetching pet details');
        }
      }
    };

    fetchPetDetails();
  }, [id]); // Fetch data whenever the pet ID changes

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/pets/${id}`);
      navigate('/pets'); // Redirect to the pet list page after deletion
    } catch (err) {
      setError('Failed to delete pet');
      console.error('Error deleting pet:', err);
    }
  };

  const handleUpdate = () => {
    navigate(`/editpet/${id}`); // Navigate to the edit pet page
  };

  return (
    <div className="pet-details-container">
      <h1>Pet Details</h1>
      {error && <p className="error-message">{error}</p>}
      {pet ? (
        <div className="pet-details">
          <table>
            <tbody>
              <tr>
                <td><strong>Name</strong></td>
                <td>{pet.petname}</td>
              </tr>
              <tr>
                <td><strong>Type</strong></td>
                <td>{pet.pettype}</td>
              </tr>
              <tr>
                <td><strong>Age</strong></td>
                <td>{pet.age}</td>
              </tr>
              <tr>
                <td><strong>Gender</strong></td>
                <td>{pet.gender}</td>
              </tr>
              <tr>
                <td><strong>Breed</strong></td>
                <td>{pet.breed}</td>
              </tr>
              <tr>
                <td><strong>Colour</strong></td>
                <td>{pet.colour}</td>
              </tr>
            </tbody>
          </table>

          {/* Buttons for Update and Delete */}
          <div className="pet-details-actions">
            <button onClick={handleUpdate}>Update Pet</button>
            <button 
              onClick={handleDelete} 
              style={{ backgroundColor: 'red', color: 'white' }}
            >
              Delete Pet
            </button>
          </div>
        </div>
      ) : (
        <p>Loading pet details...</p>
      )}
    </div>
  );
}

export default PetDetails;
