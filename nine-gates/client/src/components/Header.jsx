import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import '../styles/Header.css'

const Header = () => {
  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Typography variant="h6" component="div">
        The path to a new job isn’t always clear. There are jobs that are a great fit but might seem out of reach, and others you may not even know you have the skills for.
        We’re now putting the power of data in your hands: uncover potential career paths and see what is required to get your desired Job.
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;