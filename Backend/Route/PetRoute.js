const express = require('express');
const router = express.Router();
const {
  getPetsByOwner,
  addPet,
  getPetById,
  updatePet,
  deletePet
} = require('../Controllers/PetControllers');

router.get('/my-pets/:userId', getPetsByOwner);
router.post('/', addPet);
router.get('/:id', getPetById);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;
