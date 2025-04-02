const express = require("express");
const router = express.Router();

// Import the Pet controller
const PetController = require("../Controllers/PetControllers");

// Get all pets
router.get("/", PetController.getAllPets);

// Add a new pet
router.post("/", PetController.addPet);

// Get a pet by ID
router.get("/:id", PetController.getPetById);

// Update pet details
router.put("/:id", PetController.updatePet);

// Delete a pet
router.delete("/:id", PetController.deletePet);

module.exports = router;
