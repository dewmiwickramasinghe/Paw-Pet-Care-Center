const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Pet = require('../models/Pet');
const Treatment = require('../models/Treatment');

// Sample data for pets
const samplePets = [
  {
    name: 'Max',
    species: 'Dog',
    breed: 'Labrador',
    age: 3,
    gender: 'male',
    weight: 25,
    ownerName: 'John Smith',
    ownerContact: '0771234567',
    petId: 'PET123456',
    medicalHistory: 'Healthy, annual vaccinations up to date'
  },
  {
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    age: 2,
    gender: 'female',
    weight: 4.5,
    ownerName: 'Mary Johnson',
    ownerContact: '0777654321',
    petId: 'PET789012',
    medicalHistory: 'Treated for ear infection in 2022'
  }
];

// Sample data for treatments
const createSampleTreatments = (petIds) => {
  return [
    {
      petId: petIds[0],
      type: 'vaccination',
      date: new Date('2023-05-15'),
      performedBy: 'Dr. Wilson',
      cost: 2500,
      notes: 'Annual vaccination',
      status: 'completed'
    },
    {
      petId: petIds[0],
      type: 'checkup',
      date: new Date('2023-09-01'),
      performedBy: 'Dr. Thompson',
      cost: 1500,
      notes: 'Regular checkup, all vitals normal',
      status: 'completed'
    },
    {
      petId: petIds[1],
      type: 'deworming',
      date: new Date('2023-08-10'),
      performedBy: 'Dr. Wilson',
      cost: 1800,
      notes: 'Quarterly deworming treatment',
      status: 'completed'
    }
  ];
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB for initialization');
    
    try {
      // Check if we already have data
      const petsCount = await Pet.countDocuments();
      
      if (petsCount === 0) {
        console.log('No pets found, initializing with sample data...');
        
        // Insert sample pets
        const insertedPets = await Pet.insertMany(samplePets);
        console.log(`${insertedPets.length} sample pets added.`);
        
        // Get the pet IDs
        const petIds = insertedPets.map(pet => pet._id);
        
        // Create sample treatments with the actual pet IDs
        const sampleTreatments = createSampleTreatments(petIds);
        
        // Insert sample treatments
        const insertedTreatments = await Treatment.insertMany(sampleTreatments);
        console.log(`${insertedTreatments.length} sample treatments added.`);
        
        console.log('Database initialized successfully!');
      } else {
        console.log(`Database already contains ${petsCount} pets. Skipping initialization.`);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      // Close the connection
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 