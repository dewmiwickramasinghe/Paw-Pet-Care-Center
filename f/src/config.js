// Backend API configuration
const API_URL = 'http://localhost:5000';

// Create API endpoint URLs
const endpoints = {
  pets: `${API_URL}/api/pets`,
  treatments: `${API_URL}/api/treatments`,
  petTreatments: (petId) => `${API_URL}/api/treatments/pet/${petId}`,
  pet: (id) => `${API_URL}/api/pets/${id}`,
  treatment: (id) => `${API_URL}/api/treatments/${id}`
};

// Helper functions
const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    return `Server error: ${error.response.data.message || error.response.statusText}`;
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    return 'No response from server. Please check your connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request error:', error.message);
    return `Error: ${error.message}`;
  }
};

export { API_URL, endpoints, handleApiError }; 