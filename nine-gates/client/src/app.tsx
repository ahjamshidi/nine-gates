import * as React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles';
import CustomAppBar from './components/CustomAppBar';
import getLPTheme from './components/getLPTheme';
import { PaletteMode } from '@mui/material';
import LandingPage from './LandingPage';
import HeroDetails from './components/HeroDetails';
import { Routes, Route } from 'react-router-dom';
export default function App() {
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
      <CustomAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/hero-details' element={<HeroDetails />} />
      </Routes>
    </ThemeProvider>
  );
}
