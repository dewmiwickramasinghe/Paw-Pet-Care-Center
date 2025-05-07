import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PetList from './components/PetList';
import AddPet from './components/AddPet';
import EditPet from './components/EditPet';
import AddTreatment from './components/AddTreatment';
import EditTreatment from './components/EditTreatment';
import TreatmentList from './components/TreatmentList';
import ReportGenerator from './components/ReportGenerator';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          <Navbar />
          <Container 
            component="main" 
            maxWidth="lg" 
            sx={{ mt: 4, mb: 4, flex: 1 }}
          >
            <Routes>
              <Route path="/" element={<PetList />} />
              <Route path="/add-pet" element={<AddPet />} />
              <Route path="/edit-pet/:id" element={<EditPet />} />
              <Route path="/add-treatment" element={<AddTreatment />} />
              <Route path="/edit-treatment/:id" element={<EditTreatment />} />
              <Route path="/treatments" element={<TreatmentList />} />
              <Route path="/pet/:petId/treatments" element={<TreatmentList />} />
              <Route path="/reports" element={<ReportGenerator />} />
            </Routes>
          </Container>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
