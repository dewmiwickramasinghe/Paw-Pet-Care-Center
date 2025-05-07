import React, { useState, useEffect } from 'react';
import { 
  Snackbar, 
  Alert, 
  Badge, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    // Navigate to the treatments page with query params to highlight the specific treatment
    navigate(`/treatments?highlight=${notification.id}`);
    handleClose();
  };

  // Function to check and create notifications
  const checkForNotifications = async () => {
    try {
      // Get upcoming treatments using the dedicated endpoint
      const response = await axios.get('http://localhost:5000/api/treatments/upcoming');
      const { scheduled, followUps } = response.data;
      
      const upcomingTreatments = [];
      
      // Process scheduled treatments
      scheduled.forEach(treatment => {
        upcomingTreatments.push({
          id: treatment._id,
          petName: treatment.petId?.name || 'Unknown Pet',
          message: `Scheduled treatment (${treatment.type}) for today`,
          date: new Date(treatment.date),
          type: 'scheduled'
        });
      });
      
      // Process follow-up treatments
      followUps.forEach(treatment => {
        upcomingTreatments.push({
          id: treatment._id,
          petName: treatment.petId?.name || 'Unknown Pet',
          message: `Follow-up needed for ${treatment.petId?.name}`,
          date: new Date(treatment.followUpDate),
          type: 'follow-up'
        });
      });
      
      // Update notifications state
      setNotifications(upcomingTreatments);
      
      // Show alert if new notifications are available
      if (upcomingTreatments.length > 0 && !alert.open) {
        setAlert({
          open: true,
          message: `You have ${upcomingTreatments.length} pending notification${upcomingTreatments.length > 1 ? 's' : ''}`,
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Error checking for notifications:', error);
    }
  };
  
  // Check for notifications on component mount and every 5 minutes
  useEffect(() => {
    checkForNotifications();
    
    // Set interval to check every 5 minutes
    const interval = setInterval(() => {
      checkForNotifications();
    }, 5 * 60 * 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-controls={open ? 'notification-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '320px',
          },
        }}
      >
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="subtitle1">
            Notifications ({notifications.length})
          </Typography>
        </Box>
        <Divider />
        
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2">No pending notifications</Typography>
          </MenuItem>
        ) : (
          <List sx={{ width: '100%', p: 0 }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  button 
                  onClick={() => handleNotificationClick(notification)}
                  alignItems="flex-start"
                  sx={{
                    bgcolor: notification.type === 'scheduled' ? 'rgba(240, 165, 0, 0.1)' : 'rgba(25, 118, 210, 0.1)'
                  }}
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {notification.petName}
                        </Typography>
                        {" — "}{formatDate(notification.date)}
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Menu>
      
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setAlert({ ...alert, open: false })} 
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default NotificationSystem; 