import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AddTreatment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [formData, setFormData] = useState({
    petId: '',
    type: '',
    date: '',
    performedBy: '',
    cost: '',
    notes: '',
    status: 'completed',
    medicationDetails: {
      name: '',
      dosage: '',
      duration: ''
    },
    followUpDate: ''
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Extract petId from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const petIdFromUrl = searchParams.get('petId');
    
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pets');
        const fetchedPets = response.data;
        setPets(fetchedPets);
        setFilteredPets(fetchedPets);
        
        // If there's a petId in the URL and we haven't set it yet, set it in the form
        if (petIdFromUrl && formData.petId === '') {
          console.log('Setting petId from URL:', petIdFromUrl);
          const selectedPet = fetchedPets.find(pet => pet._id === petIdFromUrl);
          if (selectedPet) {
            setSelectedPet(selectedPet);
            setFormData(prevData => ({
              ...prevData,
              petId: petIdFromUrl
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
    
    fetchPets();
  }, [location.search]); // Removed formData dependency to avoid infinite loop

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('medicationDetails.')) {
      const field = name.split('.')[1];
      setFormData(prevData => ({
        ...prevData,
        medicationDetails: {
          ...prevData.medicationDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/treatments', formData);
      console.log('Treatment added:', response.data);
      
      setAlert({
        open: true,
        message: 'Treatment added successfully!',
        severity: 'success'
      });
      setTimeout(() => navigate('/treatments'), 2000);
    } catch (error) {
      console.error('Error adding treatment:', error);
      setAlert({
        open: true,
        message: `Error adding treatment: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // Handle pet selection from autocomplete
  const handlePetChange = (event, newValue) => {
    if (newValue) {
      setSelectedPet(newValue);
      setFormData(prevData => ({
        ...prevData,
        petId: newValue._id
      }));
    } else {
      setSelectedPet(null);
      setFormData(prevData => ({
        ...prevData,
        petId: ''
      }));
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Add New Treatment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={pets}
                  getOptionLabel={(pet) => `${pet.name} (${pet.petId})`}
                  value={selectedPet}
                  onChange={handlePetChange}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Pet"
                      required
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="body1">
                          {option.name} ({option.petId})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.species} • Owner: {option.ownerName}
                        </Typography>
                      </Box>
                    </li>
                  )}
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Treatment Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="vaccination">Vaccination</MenuItem>
                  <MenuItem value="deworming">Deworming</MenuItem>
                  <MenuItem value="checkup">Checkup</MenuItem>
                  <MenuItem value="surgery">Surgery</MenuItem>
                  <MenuItem value="grooming">Grooming</MenuItem>
                  <MenuItem value="medication">Medication</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Performed By"
                name="performedBy"
                value={formData.performedBy}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cost (LKR)"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Follow-up Date"
                name="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {formData.type === 'medication' && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Medication Details
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Medication Name"
                    name="medicationDetails.name"
                    value={formData.medicationDetails.name}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Dosage"
                    name="medicationDetails.dosage"
                    value={formData.medicationDetails.dosage}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Duration"
                    name="medicationDetails.duration"
                    value={formData.medicationDetails.duration}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={!formData.petId || !formData.type || !formData.date}
              >
                Add Treatment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AddTreatment; 