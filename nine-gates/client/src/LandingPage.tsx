import * as React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import getLPTheme from './components/getLPTheme';
import { PaletteMode } from '@mui/material';

export default function LandingPage() {
  const initPaletteMode: PaletteMode = 'light';
  const [mode, setMode] = React.useState<PaletteMode>(initPaletteMode);
  const [showCustomTheme, setShowCustomTheme] = React.useState(false);
  const LPtheme = createTheme(getLPTheme(mode) as ThemeOptions);
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Hero />
      <Box sx={{ bgcolor: 'background.default' }}>
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
