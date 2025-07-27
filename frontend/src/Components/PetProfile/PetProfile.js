import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PetProfile.css';

function PetProfile() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/pets/${petId}`);
        setPet(response.data);
      } catch (err) {
        setError('Failed to fetch pet details');
      }
    };
    fetchPet();
  }, [petId]);

  if (error) return <div className="pet-profile-error">{error}</div>;
  if (!pet) return <div className="pet-profile-loading">Loading...</div>;

  // Handler for medical record button (customize navigation as needed)
  const handleViewMedicalRecord = () => {
    navigate(`/medical-record/${pet._id}`);
  };

  return (
    <div className="pet-profile-page">
    <div className="pet-profile-container">
      <h2>Pet Profile</h2>
      <div className="pet-profile-card">
        <p><strong>Name:</strong> {pet.petname}</p>
        <p><strong>Type:</strong> {pet.pettype}</p>
        <p><strong>Age:</strong> {pet.age}</p>
        <p><strong>Gender:</strong> {pet.gender}</p>
        <p><strong>Breed:</strong> {pet.breed}</p>
        <p><strong>Colour:</strong> {pet.colour}</p>
        <button className="medical-btn" onClick={handleViewMedicalRecord}>
          View Medical Record
        </button>
      </div>
    </div>
    </div>
  );
}

export default PetProfile;
