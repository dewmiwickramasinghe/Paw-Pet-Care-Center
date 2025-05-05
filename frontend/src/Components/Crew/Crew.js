import React from 'react';
import './Crew.css'

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Veterinarian',
    bio: 'Compassionate vet with 10 years experience in animal care.',
  },
  {
    id: 2,
    name: 'Dr. Michael Lee',
    specialty: 'Surgery Specialist',
    bio: 'Expert in surgical procedures for pets.',
  },
  {
    id: 3,
    name: 'Dr. Emily Davis',
    specialty: 'Nutritionist',
    bio: 'Specializes in pet nutrition and diet planning.',
  },
  // Add more doctors as needed
  {
    id: 4,
    name: 'Dr. Karen Smith',
    specialty: 'Exotic Animal Specialist',
    bio: 'Experienced in treating birds, reptiles, and small mammals.',
  },
  {
    id: 5,
    name: 'Dr. David Brown',
    specialty: 'Dermatologist',
    bio: 'Specializes in skin conditions and allergies in pets.',
  },
  {
    id: 6,
    name: 'Dr. Lisa Green',
    specialty: 'Dental Care Specialist',
    bio: 'Focuses on oral health and dental treatments for pets.',
  },
  {
    id: 7,
    name: 'Dr. James Wilson',
    specialty: 'Emergency & Critical Care',
    bio: 'Provides 24/7 emergency care for critical pet conditions.',
  },
  {
    id: 8,
    name: 'Dr. Amanda Clark',
    specialty: 'Behaviorist',
    bio: 'Helps with behavioral issues and training for pets.',
  },
  {
    id: 9,
    name: 'Dr. Olivia Martinez',
    specialty: 'Orthopedic Specialist',
    bio: 'Expert in bone and joint care for pets.',
  },
];

function Crew() {
  return (
    <div className="crew-container">
      <h1>Meet Our Team</h1>
      <p>Our experienced doctors are here to provide the best care for your pets.</p>
      <div className="doctor-list">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="doctor-card"
          >
            {/* Remove or comment out the image tag */}
            {/* <img
              src={doctor.photo}
              alt={doctor.name}
              className="doctor-photo"
            /> */}
            <h3>{doctor.name}</h3>
            <p className="doctor-specialty">{doctor.specialty}</p>
            <p className="doctor-bio">{doctor.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Crew;
