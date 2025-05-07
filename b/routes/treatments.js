const express = require('express');
const router = express.Router();
const Treatment = require('../models/Treatment');
const mongoose = require('mongoose');

// Get all treatments
router.get('/', async (req, res) => {
  try {
    const treatments = await Treatment.find().populate('petId').sort({ date: -1 });
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new treatment
router.post('/', async (req, res) => {
  const treatment = new Treatment({
    petId: req.body.petId,
    type: req.body.type,
    date: req.body.date,
    performedBy: req.body.performedBy,
    cost: req.body.cost,
    notes: req.body.notes,
    followUpDate: req.body.followUpDate,
    medicationDetails: req.body.medicationDetails,
    status: req.body.status
  });

  try {
    const newTreatment = await treatment.save();
    const populatedTreatment = await Treatment.findById(newTreatment._id).populate('petId');
    res.status(201).json(populatedTreatment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get treatments by pet ID
router.get('/pet/:petId', async (req, res) => {
  try {
    const treatments = await Treatment.find({ petId: req.params.petId }).populate('petId').sort({ date: -1 });
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get treatment by ID
router.get('/:id', async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id).populate('petId');
    if (!treatment) {
      return res.status(404).json({ message: 'Treatment not found' });
    }
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update treatment
router.put('/:id', async (req, res) => {
  try {
    const updatedTreatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      {
        petId: req.body.petId,
        type: req.body.type,
        date: req.body.date,
        performedBy: req.body.performedBy,
        cost: req.body.cost,
        notes: req.body.notes,
        followUpDate: req.body.followUpDate,
        medicationDetails: req.body.medicationDetails,
        status: req.body.status
      },
      { new: true }
    ).populate('petId');
    
    if (!updatedTreatment) {
      return res.status(404).json({ message: 'Treatment not found' });
    }
    
    res.json(updatedTreatment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete treatment
router.delete('/:id', async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    
    if (!treatment) {
      return res.status(404).json({ message: 'Treatment not found' });
    }
    
    res.json({ message: 'Treatment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get treatments by type
router.get('/type/:treatmentType', async (req, res) => {
  try {
    const treatments = await Treatment.find({ 
      type: req.params.treatmentType 
    }).populate('petId').sort({ date: -1 });
    
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get upcoming treatments and follow-ups (for notifications)
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate date 3 days from now
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    // Find scheduled treatments for today or past
    const scheduledTreatments = await Treatment.find({
      status: 'scheduled',
      date: { $lte: today }
    }).populate('petId');
    
    // Find treatments with follow-up dates within next 3 days
    const followUpTreatments = await Treatment.find({
      followUpDate: { 
        $gte: today,
        $lte: threeDaysFromNow
      }
    }).populate('petId');
    
    res.json({
      scheduled: scheduledTreatments,
      followUps: followUpTreatments
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search treatments
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // First find pets that match the query to search by pet name
    const pets = await mongoose.model('Pet').find({
      name: { $regex: query, $options: 'i' }
    });
    
    const petIds = pets.map(pet => pet._id);
    
    const treatments = await Treatment.find({
      $or: [
        { type: { $regex: query, $options: 'i' } },
        { performedBy: { $regex: query, $options: 'i' } },
        { notes: { $regex: query, $options: 'i' } },
        { status: { $regex: query, $options: 'i' } },
        { petId: { $in: petIds } }
      ]
    }).populate('petId').sort({ date: -1 });
    
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 