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
  CircularProgress,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditTreatment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
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

  // Fetch treatment data and all pets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [treatmentResponse, petsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/treatments/${id}`),
          axios.get('http://localhost:5000/api/pets')
        ]);
        
        const treatmentData = treatmentResponse.data;
        const fetchedPets = petsResponse.data;
        
        // Format dates for input fields
        const formatDateForInput = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        };
        
        // Find the selected pet
        const petId = treatmentData.petId._id || '';
        const currentPet = fetchedPets.find(pet => pet._id === petId) || null;
        
        setSelectedPet(currentPet);
        setFormData({
          petId: petId,
          type: treatmentData.type || '',
          date: formatDateForInput(treatmentData.date),
          performedBy: treatmentData.performedBy || '',
          cost: treatmentData.cost || '',
          notes: treatmentData.notes || '',
          status: treatmentData.status || 'completed',
          medicationDetails: {
            name: treatmentData.medicationDetails?.name || '',
            dosage: treatmentData.medicationDetails?.dosage || '',
            duration: treatmentData.medicationDetails?.duration || ''
          },
          followUpDate: formatDateForInput(treatmentData.followUpDate)
        });
        
        setPets(fetchedPets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlert({
          open: true,
          message: 'Error fetching treatment data. Please try again.',
          severity: 'error'
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/treatments/${id}`, formData);
      setAlert({
        open: true,
        message: 'Treatment updated successfully!',
        severity: 'success'
      });
      setTimeout(() => navigate('/treatments'), 2000);
    } catch (error) {
      console.error('Error updating treatment:', error);
      setAlert({
        open: true,
        message: `Error updating treatment: ${error.message}`,
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit Treatment
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
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!formData.petId || !formData.type || !formData.date}
                >
                  Update Treatment
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate('/treatments')}
                >
                  Cancel
                </Button>
              </Box>
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

export default EditTreatment; 