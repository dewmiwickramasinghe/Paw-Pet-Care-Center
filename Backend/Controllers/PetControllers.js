const Pet = require("../Model/PetModel");
const { promisify } = require('util');
const mongoose = require("mongoose"); // Added for ID validation

// Get all pets
exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching pets", error: err.message });
  }
};

// Add a new pet
exports.addPet = async (req, res) => {
  try {
    const { petname, pettype, age, gender, breed, colour } = req.body;

    if (!petname || !pettype || !age || !gender || !breed || !colour) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPet = new Pet({ petname, pettype, age, gender, breed, colour });
    await newPet.save();
    res.status(201).json({ message: "Pet added successfully", pet: newPet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding pet", error: err.message });
  }
};

// Get a pet by ID with validation
exports.getPetById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid pet ID format" });
    }

    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.status(200).json(pet);
  } catch (err) {
    console.error("Error fetching pet:", err);
    res.status(500).json({ message: "Error fetching pet", error: err.message });
  }
};

// Update pet details
exports.updatePet = async (req, res) => {
  try {
    const { petname, pettype, age, gender, breed, colour } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid pet ID format" });
    }

    if (!petname || !pettype || !age || !gender || !breed || !colour) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedData = { petname, pettype, age, gender, breed, colour };

    const pet = await Pet.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json({ message: "Pet updated successfully", pet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating pet", error: err.message });
  }
};

// Delete a pet
exports.deletePet = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid pet ID format" });
    }

    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting pet", error: err.message });
  }
};
