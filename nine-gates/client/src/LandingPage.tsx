
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Hero from './components/Hero';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { useEffect } from 'react';


export default function LandingPage() {
  useEffect(() => {
    document.title = "Nine Gate"
 }, []);
  return (
    <>
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
    </>
  );
}
