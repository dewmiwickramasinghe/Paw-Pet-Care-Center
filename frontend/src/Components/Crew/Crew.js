import React, { useState } from 'react';
import './Crew.css';

const doctors = [
  { id: 1, name: 'Dr. Sadeera Thisara Kumara', specialty: 'Veterinarian', bio: 'Compassionate vet with 10 years experience in animal care.' },
  { id: 2, name: 'Dr. Michael Lee', specialty: 'Surgery Specialist', bio: 'Expert in surgical procedures for pets.' },
  { id: 3, name: 'Dr. Emily Davis', specialty: 'Nutritionist', bio: 'Specializes in pet nutrition and diet planning.' },
  { id: 4, name: 'Dr. Karen Smith', specialty: 'Exotic Animal Specialist', bio: 'Experienced in treating birds, reptiles, and small mammals.' },
  { id: 5, name: 'Dr. David Brown', specialty: 'Dermatologist', bio: 'Specializes in skin conditions and allergies in pets.' },
  { id: 6, name: 'Dr. Lisa Green', specialty: 'Dental Care Specialist', bio: 'Focuses on oral health and dental treatments for pets.' },
  { id: 7, name: 'Dr. James Wilson', specialty: 'Emergency & Critical Care', bio: 'Provides 24/7 emergency care for critical pet conditions.' },
  { id: 8, name: 'Dr. Amanda Clark', specialty: 'Behaviorist', bio: 'Helps with behavioral issues and training for pets.' },
  { id: 9, name: 'Dr. Olivia Martinez', specialty: 'Orthopedic Specialist', bio: 'Expert in bone and joint care for pets.' },
  { id: 10, name: 'Dr. Michael Taylor', specialty: 'Ophthalmologist', bio: 'Specializes in eye care for pets.' },
  { id: 11, name: 'Dr. Rachel Adams', specialty: 'Geriatrics', bio: 'Focused on elderly pet care and quality of life.' },
  { id: 12, name: 'Dr. Robert Walker', specialty: 'Behavioral Therapy', bio: 'Specializes in behavior modification for pets with anxiety or aggression.' },
  { id: 13, name: 'Dr. Jessica Martinez', specialty: 'Animal Neurologist', bio: 'Treats neurological conditions like seizures, paralysis, and head injuries.' },
  { id: 14, name: 'Dr. Benjamin Adams', specialty: 'Veterinary Cardiologist', bio: 'Focuses on heart health and treating cardiac conditions in pets.' },
  { id: 15, name: 'Dr. Alice Thompson', specialty: 'Gastroenterologist', bio: 'Treats digestive disorders and chronic stomach issues in pets.' },
  { id: 16, name: 'Dr. Brian Walker', specialty: 'Infectious Disease Specialist', bio: 'Handles bacterial, viral, and parasitic infections in pets.' },
  { id: 17, name: 'Dr. Lisa Peterson', specialty: 'Veterinary Dermatologist', bio: 'Specializes in treating skin diseases and allergies in pets.' },
  { id: 18, name: 'Dr. Sarah Cole', specialty: 'Ophthalmologist', bio: 'Treats eye conditions and vision problems in pets.' },
  { id: 19, name: 'Dr. Mark Johnson', specialty: 'Veterinary Oncologist', bio: 'Treats cancer and related conditions in pets.' },
  { id: 20, name: 'Dr. Rachel Moore', specialty: 'Endocrinologist', bio: 'Specializes in hormone disorders like diabetes and thyroid conditions.' },
  { id: 21, name: 'Dr. Isabel Wilson', specialty: 'General Vet', bio: 'Offers comprehensive care for all kinds of pets.' },
  { id: 22, name: 'Dr. Peter Harris', specialty: 'Surgery', bio: 'Experienced in bone and joint surgeries for pets.' },
  { id: 23, name: 'Dr. Karen Foster', specialty: 'Ophthalmologist', bio: 'Treats eye diseases and vision problems in pets.' },
  { id: 24, name: 'Dr. Jason White', specialty: 'Nutritionist', bio: 'Helps in managing pets’ diets for optimal health.' },
  { id: 25, name: 'Dr. Sandra Green', specialty: 'Geriatrics', bio: 'Specializing in the health of older pets.' },
  { id: 26, name: 'Dr. Olivia Moore', specialty: 'Oncology', bio: 'Treats cancer in pets with cutting-edge therapies.' },
  { id: 27, name: 'Dr. Steven Wright', specialty: 'Cardiologist', bio: 'Specializes in diagnosing and treating heart diseases.' },
  { id: 28, name: 'Dr. Chloe Scott', specialty: 'Orthopedic Specialist', bio: 'Treats bones, joints, and muscle problems in pets.' },
  { id: 29, name: 'Dr. Daniel Black', specialty: 'Emergency Care', bio: 'Available around the clock for critical care.' },
  { id: 30, name: 'Dr. Sarah Baker', specialty: 'Behaviorist', bio: 'Helps with behavioral issues and training for pets.' },
  { id: 31, name: 'Dr. Naomi Williams', specialty: 'Specialist', bio: 'Expert in exotic animal treatment and care.' },
  { id: 32, name: 'Dr. Peter Clark', specialty: 'Ophthalmologist', bio: 'Treats pet eye conditions and vision-related problems.' },
  { id: 33, name: 'Dr. Daniel Hall', specialty: 'Internal Medicine', bio: 'Specializing in treating diseases and disorders inside the pet’s body.' },
  { id: 34, name: 'Dr. Kimberly Young', specialty: 'Surgery', bio: 'Highly skilled in surgical procedures for pets.' },
  { id: 35, name: 'Dr. Brian Taylor', specialty: 'Neurologist', bio: 'Focuses on treating neurological disorders in animals.' },
  { id: 36, name: 'Dr. Lauren Harris', specialty: 'Cardiology', bio: 'Specializes in heart health for pets.' },
  { id: 37, name: 'Dr. Jeffrey Moore', specialty: 'Dermatologist', bio: 'Treats skin diseases and allergic reactions.' },
  { id: 38, name: 'Dr. Benjamin King', specialty: 'Surgery', bio: 'A top-notch surgeon for pets in critical need of treatment.' },
  { id: 39, name: 'Dr. Julia Harris', specialty: 'General Vet', bio: 'Cares for a variety of pets with general health issues.' },
  { id: 40, name: 'Dr. Thomas Lee', specialty: 'Veterinarian', bio: 'A passionate veterinarian with expertise in small animals.' },
  { id: 41, name: 'Dr. Jessica Martin', specialty: 'Geriatrics', bio: 'Specializes in caring for elderly pets with aging-related conditions.' },
  { id: 42, name: 'Dr. Robert Brown', specialty: 'Surgery', bio: 'Performs delicate surgeries for pet care.' },
  { id: 43, name: 'Dr. Megan Adams', specialty: 'Emergency Care', bio: 'Available for emergency surgeries and treatments.' },
  { id: 44, name: 'Dr. Adam Cooper', specialty: 'Orthopedic Specialist', bio: 'Works on bone and joint conditions in pets.' },
  { id: 45, name: 'Dr. Tracy Clark', specialty: 'Veterinary Dentist', bio: 'Provides oral care and treats dental diseases in pets.' },
  { id: 46, name: 'Dr. Kelly Green', specialty: 'Nutritionist', bio: 'Helps manage your pet’s diet for optimal health and energy.' },
  { id: 47, name: 'Dr. Rachel Scott', specialty: 'Emergency Care', bio: 'Handles critical situations with prompt and skilled care.' },
  { id: 48, name: 'Dr. Vanessa Moore', specialty: 'Internal Medicine', bio: 'Specializes in treating internal organ conditions in pets.' },
  { id: 49, name: 'Dr. Andrew White', specialty: 'Cardiologist', bio: 'Works on heart conditions in pets, offering advanced treatments.' },
  { id: 50, name: 'Dr. Victoria Ross', specialty: 'Surgery Specialist', bio: 'Performs complex surgeries on various animal species.' },
  { id: 51, name: 'Dr. Sarah Johnson', specialty: 'Veterinarian', bio: 'Compassionate vet with 10 years experience in animal care.' },
  { id: 52, name: 'Dr. Michael Lee', specialty: 'Surgery Specialist', bio: 'Expert in surgical procedures for pets.' },
  { id: 53, name: 'Dr. Emily Davis', specialty: 'Nutritionist', bio: 'Specializes in pet nutrition and diet planning.' },
  { id: 54, name: 'Dr. Karen Smith', specialty: 'Exotic Animal Specialist', bio: 'Experienced in treating birds, reptiles, and small mammals.' },
  { id: 55, name: 'Dr. David Brown', specialty: 'Dermatologist', bio: 'Specializes in skin conditions and allergies in pets.' },
  { id: 56, name: 'Dr. Lisa Green', specialty: 'Dental Care Specialist', bio: 'Focuses on oral health and dental treatments for pets.' },
  { id: 57, name: 'Dr. James Wilson', specialty: 'Emergency & Critical Care', bio: 'Provides 24/7 emergency care for critical pet conditions.' },
  { id: 58, name: 'Dr. Amanda Clark', specialty: 'Behaviorist', bio: 'Helps with behavioral issues and training for pets.' },
  { id: 59, name: 'Dr. Olivia Martinez', specialty: 'Orthopedic Specialist', bio: 'Expert in bone and joint care for pets.' },
  { id: 60, name: 'Dr. Michael Taylor', specialty: 'Ophthalmologist', bio: 'Specializes in eye care for pets.' },
  { id: 61, name: 'Dr. Rachel Adams', specialty: 'Geriatrics', bio: 'Focused on elderly pet care and quality of life.' },
  { id: 62, name: 'Dr. John Walker', specialty: 'Cardiology', bio: 'Specializes in heart conditions and diseases in pets.' },
  { id: 63, name: 'Dr. Natasha Williams', specialty: 'Emergency Vet', bio: 'Available 24/7 for emergency pet care.' },
  { id: 64, name: 'Dr. Mark Miller', specialty: 'Surgery', bio: 'Expert in complex surgeries for pets.' },
  { id: 65, name: 'Dr. Jenny Taylor', specialty: 'Neurologist', bio: 'Specializing in neurological disorders in pets.' },
  { id: 66, name: 'Dr. Chris Thomas', specialty: 'Dermatologist', bio: 'Specializes in treating allergies and skin diseases.' },
  { id: 67, name: 'Dr. Lisa Allen', specialty: 'Anesthesiologist', bio: 'Ensures safety during surgeries with anesthesia expertise.' },
  { id: 68, name: 'Dr. Michael Robinson', specialty: 'Surgery', bio: 'Specialized in soft tissue and orthopedic surgeries.' },
  { id: 69, name: 'Dr. Sophia Carter', specialty: 'Dentist', bio: 'Provides dental treatments and oral care for pets.' },
  { id: 70, name: 'Dr. Adam Lee', specialty: 'Emergency Care', bio: 'Provides quick and critical care in emergency situations.' },
  { id: 71, name: 'Dr. Isabel Wilson', specialty: 'General Vet', bio: 'Offers comprehensive care for all kinds of pets.' },
  { id: 72, name: 'Dr. Peter Harris', specialty: 'Surgery', bio: 'Experienced in bone and joint surgeries for pets.' },
  { id: 73, name: 'Dr. Karen Foster', specialty: 'Ophthalmologist', bio: 'Treats eye diseases and vision problems in pets.' },
  { id: 74, name: 'Dr. Jason White', specialty: 'Nutritionist', bio: 'Helps in managing pets’ diets for optimal health.' },
  { id: 75, name: 'Dr. Sandra Green', specialty: 'Geriatrics', bio: 'Specializing in the health of older pets.' },
  { id: 76, name: 'Dr. Olivia Moore', specialty: 'Oncology', bio: 'Treats cancer in pets with cutting-edge therapies.' },
  { id: 77, name: 'Dr. Steven Wright', specialty: 'Cardiologist', bio: 'Specializes in diagnosing and treating heart diseases.' },
  { id: 78, name: 'Dr. Chloe Scott', specialty: 'Orthopedic Specialist', bio: 'Treats bones, joints, and muscle problems in pets.' },
  { id: 79, name: 'Dr. Daniel Black', specialty: 'Emergency Care', bio: 'Available around the clock for critical care.' },
  { id: 80, name: 'Dr. Sarah Baker', specialty: 'Behaviorist', bio: 'Helps with behavioral issues and training for pets.' },
  { id: 81, name: 'Dr. Naomi Williams', specialty: 'Specialist', bio: 'Expert in exotic animal treatment and care.' },
  { id: 82, name: 'Dr. Peter Clark', specialty: 'Ophthalmologist', bio: 'Treats pet eye conditions and vision-related problems.' },
  { id: 83, name: 'Dr. Daniel Hall', specialty: 'Internal Medicine', bio: 'Specializing in treating diseases and disorders inside the pet’s body.' },
  { id: 84, name: 'Dr. Kimberly Young', specialty: 'Surgery', bio: 'Highly skilled in surgical procedures for pets.' },
  { id: 85, name: 'Dr. Brian Taylor', specialty: 'Neurologist', bio: 'Focuses on treating neurological disorders in animals.' },
  { id: 86, name: 'Dr. Lauren Harris', specialty: 'Cardiology', bio: 'Specializes in heart health for pets.' },
  { id: 87, name: 'Dr. Jeffrey Moore', specialty: 'Dermatologist', bio: 'Treats skin diseases and allergic reactions.' },
  { id: 88, name: 'Dr. Benjamin King', specialty: 'Surgery', bio: 'A top-notch surgeon for pets in critical need of treatment.' },
  { id: 89, name: 'Dr. Julia Harris', specialty: 'General Vet', bio: 'Cares for a variety of pets with general health issues.' },
  { id: 90, name: 'Dr. Thomas Lee', specialty: 'Veterinarian', bio: 'A passionate veterinarian with expertise in small animals.' },
  { id: 91, name: 'Dr. Jessica Martin', specialty: 'Geriatrics', bio: 'Specializes in caring for elderly pets with aging-related conditions.' },
  { id: 92, name: 'Dr. Robert Brown', specialty: 'Surgery', bio: 'Performs delicate surgeries for pet care.' },
  { id: 93, name: 'Dr. Megan Adams', specialty: 'Emergency Care', bio: 'Available for emergency surgeries and treatments.' },
  { id: 94, name: 'Dr. Adam Cooper', specialty: 'Orthopedic Specialist', bio: 'Works on bone and joint conditions in pets.' },
  { id: 95, name: 'Dr. Tracy Clark', specialty: 'Veterinary Dentist', bio: 'Provides oral care and treats dental diseases in pets.' },
  { id: 96, name: 'Dr. Kelly Green', specialty: 'Nutritionist', bio: 'Helps manage your pet’s diet for optimal health and energy.' },
  { id: 97, name: 'Dr. Rachel Scott', specialty: 'Emergency Care', bio: 'Handles critical situations with prompt and skilled care.' },
  { id: 98, name: 'Dr. Vanessa Moore', specialty: 'Internal Medicine', bio: 'Specializes in treating internal organ conditions in pets.' },
  { id: 99, name: 'Dr. Andrew White', specialty: 'Cardiologist', bio: 'Works on heart conditions in pets, offering advanced treatments.' },
  { id: 100, name: 'Dr. Victoria Ross', specialty: 'Surgery Specialist', bio: 'Performs complex surgeries on various animal species.' },
];

const Crew = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="crew-page">
    <div className="crew-container">
      <h1>Meet Our Expert Team of Doctors</h1>
      <p>Our doctors are here to provide the best care for your pets.</p>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="doctor-list">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <h3>{doctor.name}</h3>
            <p>{doctor.specialty}</p>
            <p>{doctor.bio}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
   
  );
  
};

export default Crew;
