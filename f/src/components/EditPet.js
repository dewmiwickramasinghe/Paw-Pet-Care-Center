import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Snackbar,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditPet() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: 'unknown',
    weight: '',
    ownerName: '',
    ownerContact: '',
    medicalHistory: ''
  });
  
  const [errors, setErrors] = useState({
    name: ''
  });
  
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  // Validation function to check if name contains symbols
  const validateName = (name) => {
    // Regex to check if string contains only letters, numbers and spaces
    const nameRegex = /^[A-Za-z0-9\s]+$/;
    return nameRegex.test(name);
  };

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pets/${id}`);
        const petData = response.data;
        
        // Update form with existing pet data
        setFormData({
          name: petData.name || '',
          species: petData.species || '',
          breed: petData.breed || '',
          age: petData.age || '',
          gender: petData.gender || 'unknown',
          weight: petData.weight || '',
          ownerName: petData.ownerName || '',
          ownerContact: petData.ownerContact || '',
          medicalHistory: petData.medicalHistory || ''
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pet details:', error);
        setAlert({
          open: true,
          message: 'Error fetching pet details. Please try again.',
          severity: 'error'
        });
        setLoading(false);
      }
    };
    
    fetchPetDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate pet name 
    if (name === 'name' && value.trim() !== '') {
      if (!validateName(value)) {
        setErrors({
          ...errors,
          name: 'Pet name should only contain letters, numbers, and spaces. No symbols allowed.'
        });
      } else {
        setErrors({
          ...errors,
          name: ''
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateName(formData.name)) {
      setErrors({
        ...errors,
        name: 'Pet name should only contain letters, numbers, and spaces. No symbols allowed.'
      });
      setAlert({
        open: true,
        message: 'Please fix the errors in the form before submitting.',
        severity: 'error'
      });
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/pets/${id}`, formData);
      setAlert({
        open: true,
        message: 'Pet details updated successfully!',
        severity: 'success'
      });
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setAlert({
        open: true,
        message: 'Error updating pet details. Please try again.',
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
          Edit Pet Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pet Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
                error={!!errors.name}
                helperText={errors.name}
                inputProps={{
                  maxLength: 50
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="unknown">Unknown</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                margin="normal"
                inputProps={{ step: 0.1, min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Owner's Name"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Owner's Contact"
                name="ownerContact"
                value={formData.ownerContact}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Medical History"
                name="medicalHistory"
                value={formData.medicalHistory}
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
                  disabled={!!errors.name}
                >
                  Update Pet
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate('/')}
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

export default EditPet; 