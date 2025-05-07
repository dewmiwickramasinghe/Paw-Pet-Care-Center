import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PetList() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const fetchPets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pets');
      const fetchedPets = response.data;
      setAllPets(fetchedPets); // Store all pets for filtering
      setPets(fetchedPets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Filter pets based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setPets(allPets);
      return;
    }

    // Debounce search to prevent too many API calls
    const handler = setTimeout(async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pets/search?query=${searchQuery}`);
        setPets(response.data);
      } catch (error) {
        console.error('Error searching pets:', error);
        // Fallback to client-side filtering if API fails
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filteredPets = allPets.filter(
          pet => 
            pet.name.toLowerCase().includes(lowerCaseQuery) ||
            pet.petId.toLowerCase().includes(lowerCaseQuery) ||
            pet.species.toLowerCase().includes(lowerCaseQuery) ||
            (pet.breed && pet.breed.toLowerCase().includes(lowerCaseQuery)) ||
            pet.ownerName.toLowerCase().includes(lowerCaseQuery)
        );
        setPets(filteredPets);
      }
    }, 300); // 300ms debounce time

    return () => clearTimeout(handler);
  }, [searchQuery, allPets]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = (pet) => {
    setSelectedPet(pet);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/pets/${selectedPet._id}`);
      setConfirmDeleteOpen(false);
      setAlert({
        open: true,
        message: 'Pet deleted successfully!',
        severity: 'success'
      });
      fetchPets(); // Refresh the list
    } catch (error) {
      setConfirmDeleteOpen(false);
      setAlert({
        open: true,
        message: 'Error deleting pet. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleViewDetails = (pet) => {
    setSelectedPet(pet);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Registered Pets
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/add-pet')}
        >
          Add New Pet
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search pets by name, ID, species, breed or owner..."
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {pets.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            {searchQuery.trim() !== '' 
              ? 'No pets match your search criteria' 
              : 'No pets registered yet'}
          </Typography>
          {searchQuery.trim() !== '' && (
            <Button 
              variant="text" 
              color="primary" 
              onClick={() => setSearchQuery('')}
              sx={{ mt: 1 }}
            >
              Clear Search
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                '& th': { 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  padding: '16px 8px'
                }
              }}>
                <TableCell>Pet ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Species</TableCell>
                <TableCell>Breed</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pets.map((pet) => (
                <TableRow key={pet._id}>
                  <TableCell>{pet.petId}</TableCell>
                  <TableCell>{pet.name}</TableCell>
                  <TableCell>{pet.species}</TableCell>
                  <TableCell>{pet.breed || '-'}</TableCell>
                  <TableCell>{pet.age}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{pet.gender}</TableCell>
                  <TableCell>{pet.ownerName}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton color="primary" onClick={() => handleViewDetails(pet)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton color="secondary" onClick={() => navigate(`/edit-pet/${pet._id}`)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(pet)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedPet?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Pet Details</DialogTitle>
        <DialogContent>
          {selectedPet && (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {selectedPet.name} ({selectedPet.petId})
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Species:</Typography>
                  <Typography>{selectedPet.species}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Breed:</Typography>
                  <Typography>{selectedPet.breed || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Age:</Typography>
                  <Typography>{selectedPet.age} years</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Gender:</Typography>
                  <Typography sx={{ textTransform: 'capitalize' }}>{selectedPet.gender}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Weight:</Typography>
                  <Typography>{selectedPet.weight ? `${selectedPet.weight} kg` : '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Owner:</Typography>
                  <Typography>{selectedPet.ownerName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Contact:</Typography>
                  <Typography>{selectedPet.ownerContact || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Medical History:</Typography>
                  <Typography>{selectedPet.medicalHistory || 'No medical history recorded'}</Typography>
                </Grid>
              </Grid>
              
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 3, mr: 1 }}
                onClick={() => navigate(`/add-treatment/?petId=${selectedPet._id}`)}
              >
                Add Treatment
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 3 }}
                onClick={() => {
                  setDetailsOpen(false);
                  navigate(`/edit-pet/${selectedPet._id}`);
                }}
              >
                Edit Pet
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PetList; 