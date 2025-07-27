import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from './dodo.png'; // Ensure path to logo is correct
import './MyPet.css';

function MyPets() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const reportRef = useRef();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/pets/my-pets/${userId}`);
        setPets(response.data);
      } catch (err) {
        setError('Error fetching pets');
        console.error(err);
      }
    };

    if (userId) fetchPets();
  }, [userId]);

  const handleEditPet = (petId) => {
    navigate(`/updatepet/${petId}`);
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await axios.delete(`http://localhost:5000/pets/${petId}`);
        setPets(pets.filter((pet) => pet._id !== petId));
      } catch (err) {
        setError('Error deleting pet');
        console.error(err);
      }
    }
  };

  const handleViewProfile = (petId) => {
    navigate(`/pet-profile/${petId}`);
  };

  const downloadReport = () => {
    const input = reportRef.current;
    const elementsToHide = input.querySelectorAll('.no-print');
    elementsToHide.forEach(el => el.style.display = 'none');

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('MyPetsReport.pdf');
      elementsToHide.forEach(el => el.style.display = '');
    });
  };

  return (
    <div className="My-pets-page">
      <div>
        {/* "My Pets" heading will show on the page but not in the PDF */}
        <h1 className="no-print">My Pets</h1> {/* Add no-print here to hide it in the print but still display it on page */}
        
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div ref={reportRef}>
          <div className="report-header">
            <img src={logo} alt="Logo" className="report-logo" />
            <h2>My Pets Report</h2>
          </div>

          {pets.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Pet Name</th>
                  <th>Pet Type</th>
                  <th>Age</th>
                  <th>Breed</th>
                  <th>Colour</th>
                  <th className="no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet._id}>
                    <td>{pet.petname}</td>
                    <td>{pet.pettype}</td>
                    <td>{pet.age}</td>
                    <td>{pet.breed}</td>
                    <td>{pet.colour}</td>
                    <td className="no-print">
                      <button
                        className="update-btn action-btn"
                        onClick={() => handleEditPet(pet._id)}
                      >
                        Update
                      </button>
                      <button
                        className="delete-btn action-btn"
                        onClick={() => handleDeletePet(pet._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="profile-btn"
                        title="View Pet Profile"
                        onClick={() => handleViewProfile(pet._id)}
                      >
                        👤
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No pets found. Add a pet!</p>
          )}
        </div>

        <button
          className="fixed-button no-print"
          onClick={downloadReport}
          title="Download Report"
          aria-label="Download Report"
        >
          Download ⬇️
        </button>
      </div>
    </div>
  );
}

export default MyPets;
