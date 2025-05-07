import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NotificationSystem from './NotificationSystem';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Pet Care Management
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={RouterLink} to="/">
            Pets
          </Button>
          <Button color="inherit" component={RouterLink} to="/add-pet">
            Add Pet
          </Button>
          <Button color="inherit" component={RouterLink} to="/add-treatment">
            Add Treatment
          </Button>
          <Button color="inherit" component={RouterLink} to="/treatments">
            Treatments
          </Button>
          <Button color="inherit" component={RouterLink} to="/reports">
            Reports
          </Button>
          <NotificationSystem />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 