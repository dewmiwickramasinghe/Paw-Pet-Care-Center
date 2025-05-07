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
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function TreatmentList() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [treatments, setTreatments] = useState([]);
  const [allTreatments, setAllTreatments] = useState([]);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [highlightedTreatmentId, setHighlightedTreatmentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Extract highlightId from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const highlightId = searchParams.get('highlight');
    if (highlightId) {
      setHighlightedTreatmentId(highlightId);
      // Auto-open the treatment details if highlighted
      setTimeout(() => {
        const treatment = treatments.find(t => t._id === highlightId);
        if (treatment) {
          setSelectedTreatment(treatment);
          setDetailsOpen(true);
        }
      }, 500);
    }
  }, [location.search, treatments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let petData = null;
        let treatmentsData = [];

        if (petId) {
          const [petResponse, treatmentsResponse] = await Promise.all([
            axios.get(`http://localhost:5000/api/pets/${petId}`),
            axios.get(`http://localhost:5000/api/treatments/pet/${petId}`)
          ]);
          
          petData = petResponse.data;
          treatmentsData = treatmentsResponse.data;
        } else {
          // If no petId in URL, fetch all treatments
          const response = await axios.get('http://localhost:5000/api/treatments');
          treatmentsData = response.data;
        }
        
        setPet(petData);
        setAllTreatments(treatmentsData); // Store all treatments for filtering
        setTreatments(treatmentsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [petId]);

  // Filter treatments based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setTreatments(allTreatments);
      return;
    }

    // Debounce search to prevent too many API calls
    const handler = setTimeout(async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/treatments/search?query=${searchQuery}`);
        
        // If we're in pet-specific view, only show that pet's treatments
        const filteredResults = petId 
          ? response.data.filter(treatment => treatment.petId._id === petId)
          : response.data;
          
        setTreatments(filteredResults);
      } catch (error) {
        console.error('Error searching treatments:', error);
        // Fallback to client-side filtering if API fails
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filteredTreatments = allTreatments.filter(
          treatment => 
            (treatment.type && treatment.type.toLowerCase().includes(lowerCaseQuery)) ||
            (treatment.performedBy && treatment.performedBy.toLowerCase().includes(lowerCaseQuery)) ||
            (treatment.notes && treatment.notes.toLowerCase().includes(lowerCaseQuery)) ||
            (treatment.status && treatment.status.toLowerCase().includes(lowerCaseQuery)) ||
            (treatment.petId && treatment.petId.name && treatment.petId.name.toLowerCase().includes(lowerCaseQuery))
        );
        setTreatments(filteredTreatments);
      }
    }, 300); // 300ms debounce time

    return () => clearTimeout(handler);
  }, [searchQuery, allTreatments, petId]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (treatment) => {
    setSelectedTreatment(treatment);
    setDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            {pet ? `Treatments for ${pet.name}` : 'All Treatments'}
          </Typography>
          {pet && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate(`/add-treatment?petId=${pet._id}`)}
            >
              Add New Treatment
            </Button>
          )}
        </Box>
        
        {pet && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Pet ID: {pet.petId} | Species: {pet.species} | Owner: {pet.ownerName}
            </Typography>
          </Box>
        )}
      </Box>

      <TextField
        fullWidth
        placeholder="Search treatments by type, performer, status, pet name or notes..."
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

      {treatments.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            {searchQuery.trim() !== '' 
              ? 'No treatments match your search criteria' 
              : 'No treatments found'}
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
          {pet && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate(`/add-treatment?petId=${pet._id}`)}
            >
              Add First Treatment
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
                {!pet && <TableCell>Pet</TableCell>}
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Performed By</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {treatments.map((treatment) => (
                <TableRow 
                  key={treatment._id}
                  sx={{ 
                    backgroundColor: highlightedTreatmentId === treatment._id 
                      ? 'rgba(25, 118, 210, 0.1)' 
                      : 'inherit' 
                  }}
                >
                  {!pet && (
                    <TableCell>
                      {treatment.petId ? (
                        <Typography variant="body2">
                          {treatment.petId.name} ({treatment.petId.petId})
                        </Typography>
                      ) : 'Unknown'}
                    </TableCell>
                  )}
                  <TableCell sx={{ textTransform: 'capitalize' }}>
                    {treatment.type}
                  </TableCell>
                  <TableCell>{formatDate(treatment.date)}</TableCell>
                  <TableCell>{treatment.performedBy || '-'}</TableCell>
                  <TableCell>
                    {treatment.cost ? `Rs. ${treatment.cost.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={treatment.status} 
                      color={getStatusColor(treatment.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton color="primary" onClick={() => handleViewDetails(treatment)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton color="secondary" onClick={() => navigate(`/edit-treatment/${treatment._id}`)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Treatment Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Treatment Details</DialogTitle>
        <DialogContent>
          {selectedTreatment && (
            <Box>
              <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 2 }}>
                {selectedTreatment.type} - {formatDate(selectedTreatment.date)}
              </Typography>
              
              <Grid container spacing={2}>
                {!pet && selectedTreatment.petId && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Pet:</Typography>
                    <Typography>
                      {selectedTreatment.petId.name} ({selectedTreatment.petId.petId})
                    </Typography>
                  </Grid>
                )}
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Performed By:</Typography>
                  <Typography>{selectedTreatment.performedBy || 'Not specified'}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status:</Typography>
                  <Chip 
                    label={selectedTreatment.status} 
                    color={getStatusColor(selectedTreatment.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Cost:</Typography>
                  <Typography>
                    {selectedTreatment.cost ? `Rs. ${selectedTreatment.cost.toFixed(2)}` : 'Not specified'}
                  </Typography>
                </Grid>
                
                {selectedTreatment.followUpDate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Follow-up Date:</Typography>
                    <Typography>{formatDate(selectedTreatment.followUpDate)}</Typography>
                  </Grid>
                )}
                
                {selectedTreatment.type === 'medication' && selectedTreatment.medicationDetails && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Medication Details:</Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2">Name:</Typography>
                          <Typography>{selectedTreatment.medicationDetails.name || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2">Dosage:</Typography>
                          <Typography>{selectedTreatment.medicationDetails.dosage || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2">Duration:</Typography>
                          <Typography>{selectedTreatment.medicationDetails.duration || 'Not specified'}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>Notes:</Typography>
                  <Typography>{selectedTreatment.notes || 'No notes'}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setDetailsOpen(false);
              navigate(`/edit-treatment/${selectedTreatment._id}`);
            }}
          >
            Edit Treatment
          </Button>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TreatmentList; 