const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');

// Generate unique Pet ID
const generatePetId = () => {
  return 'PET' + Date.now().toString().slice(-6);
};

// Validation middleware for pet name
const validatePetName = (req, res, next) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Pet name is required' });
  }
  
  // Regex to check if name contains only letters, numbers and spaces
  const nameRegex = /^[A-Za-z0-9\s]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ 
      message: 'Pet name should only contain letters, numbers, and spaces. No symbols allowed.' 
    });
  }
  
  next();
};

// Get all pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new pet
router.post('/', validatePetName, async (req, res) => {
  const pet = new Pet({
    name: req.body.name,
    species: req.body.species,
    breed: req.body.breed,
    age: req.body.age,
    gender: req.body.gender,
    weight: req.body.weight,
    ownerName: req.body.ownerName,
    ownerContact: req.body.ownerContact,
    medicalHistory: req.body.medicalHistory,
    petId: generatePetId()
  });

  try {
    const newPet = await pet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (pet) {
      res.json(pet);
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update pet
router.put('/:id', validatePetName, async (req, res) => {
  try {
    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id, 
      { 
        name: req.body.name,
        species: req.body.species,
        breed: req.body.breed,
        age: req.body.age,
        gender: req.body.gender,
        weight: req.body.weight,
        ownerName: req.body.ownerName,
        ownerContact: req.body.ownerContact,
        medicalHistory: req.body.medicalHistory
      },
      { new: true }
    );
    
    if (!updatedPet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete pet
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.json({ message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search pets
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const pets = await Pet.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { petId: { $regex: query, $options: 'i' } },
        { species: { $regex: query, $options: 'i' } },
        { breed: { $regex: query, $options: 'i' } },
        { ownerName: { $regex: query, $options: 'i' } },
        { ownerContact: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search pets by name or species
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const pets = await Pet.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { species: { $regex: searchQuery, $options: 'i' } },
        { ownerName: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 