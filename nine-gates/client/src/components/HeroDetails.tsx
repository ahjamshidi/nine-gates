import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import DetailsDashboard from './DetailsDashboard';

export default function HeroDetails() {
  const location = useLocation();
  const { currentJob, desiredJob } = location.state || {
    currentJob: '',
    desiredJob: '',
  };
  return (
    <Box
      id='hero'
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant='h1'
            sx={{
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
            }}
          >
            Get an{' '}
            <Typography
              component='span'
              sx={{
                fontSize: 'clamp(3rem, 10vw, 4rem)',
                color: (theme) =>
                  theme.palette.mode === 'light'
                    ? 'primary.main'
                    : 'primary.light',
              }}
            >
              in-depth view
            </Typography>{' '}
            of how your skills match up with job requirements.
          </Typography>
          <DetailsDashboard currentJob={currentJob} desiredJob={desiredJob} />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf='center'
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          ></Stack>
          <Typography
            variant='caption'
            textAlign='center'
            sx={{ opacity: 0.8 }}
          >
            By clicking each &quot;Skill&quot; you will access its description.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
