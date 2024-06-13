
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Hero from './components/Hero';
import FAQ from './components/FAQ';
import Footer from './components/Footer';


export default function LandingPage() {
  
  //TODO: move them provider to main page
  //TODO: move them AppAppBar to main page
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
