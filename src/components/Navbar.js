import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Navbar = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <AccountBalanceIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Smart Budget Tracker
          </Typography>
        </Box>
        <Button 
          color="inherit" 
          component={Link} 
          to="/" 
          sx={{ textTransform: 'none', mr: 2 }}
        >
          Home
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;