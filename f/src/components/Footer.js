import React from 'react';
import { Box, Container, Typography, Grid, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PetsIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Pet Care Management System
              </Typography>
            </Box>
            <Typography variant="body2">
              Providing the best care for your beloved pets with our comprehensive 
              pet management tools and services.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link to="/" style={{ color: 'white', display: 'block', marginBottom: '8px', textDecoration: 'none' }} className="footer-link">
              Pets
            </Link>
            <Link to="/add-pet" style={{ color: 'white', display: 'block', marginBottom: '8px', textDecoration: 'none' }} className="footer-link">
              Register Pet
            </Link>
            <Link to="/treatments" style={{ color: 'white', display: 'block', marginBottom: '8px', textDecoration: 'none' }} className="footer-link">
              Treatments
            </Link>
            <Link to="/reports" style={{ color: 'white', display: 'block', marginBottom: '8px', textDecoration: 'none' }} className="footer-link">
              Reports
            </Link>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body2" paragraph>
              Email: info@petcare.com
            </Typography>
            <Typography variant="body2" paragraph>
              Phone: +94 11 234 5678
            </Typography>
            <Typography variant="body2">
              Address: 123 Animal Care Lane, Colombo
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        
        <Typography variant="body2" align="center">
          © {currentYear} Pet Care Management System. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer; 