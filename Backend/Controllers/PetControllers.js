const Pet = require('../Model/PetModel');
const mongoose = require('mongoose');

// Get pets by owner/user ID
exports.getPetsByOwner = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid owner ID format' });
    }
    // Query pets where owner equals userId
    const pets = await Pet.find({ owner: userId });
    if (!pets.length) {
      return res.status(404).json({ message: 'No pets found for this owner' });
    }
    res.status(200).json(pets);
  } catch (err) {
    console.error('Error fetching pets by owner:', err);
    res.status(500).json({ message: 'Error fetching pets by owner', error: err.message });
  }
};

exports.addPet = async (req, res) => {
  try {
    const { petname, pettype, age, gender, breed, colour, owner } = req.body;
    if (!petname || !pettype || !age || !gender || !breed || !colour || !owner) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newPet = new Pet({ petname, pettype, age, gender, breed, colour, owner });
    await newPet.save();
    res.status(201).json({ message: 'Pet added successfully', pet: newPet });
  } catch (err) {
    console.error('Error adding pet:', err);
    res.status(500).json({ message: 'Error adding pet', error: err.message });
  }
};

exports.getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pet ID format' });
    }
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json(pet);
  } catch (err) {
    console.error('Error fetching pet:', err);
    res.status(500).json({ message: 'Error fetching pet', error: err.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { petname, pettype, age, gender, breed, colour } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pet ID format' });
    }
    if (!petname || !pettype || !age || !gender || !breed || !colour) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const updatedData = { petname, pettype, age, gender, breed, colour };
    const pet = await Pet.findByIdAndUpdate(id, updatedData, { new: true });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json({ message: 'Pet updated successfully', pet });
  } catch (err) {
    console.error('Error updating pet:', err);
    res.status(500).json({ message: 'Error updating pet', error: err.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pet ID format' });
    }
    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err) {
    console.error('Error deleting pet:', err);
    res.status(500).json({ message: 'Error deleting pet', error: err.message });
  }
};
