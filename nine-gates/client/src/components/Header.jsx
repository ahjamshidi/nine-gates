import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div">
        The path to a new job isn’t always clear. There are jobs that are a great fit but might seem out of reach, and others you may not even know you have the skills for.
        We’re now putting the power of the ESCO data in your hands: uncover potential career paths and see how your skills match to real job titles.
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;