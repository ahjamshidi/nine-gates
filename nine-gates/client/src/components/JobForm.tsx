import React, { FormEvent, useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { searchOccupationsByTitle } from '../helpers/api';
import '../styles/JobForm.css';
import { useNavigate, useLocation } from 'react-router-dom';
// todo fix prop type
const JobForm = ({
  formSubmitHandler,
  initialCurrentJob = '',
  initialDesiredJob = '',
}: {
  formSubmitHandler: (currentJob: string, desiredJob: string) => void;
  initialCurrentJob?: string;
  initialDesiredJob?: string;
}) => {
  const [currentJob, setCurrentJob] = useState('');
  const [desiredJob, setDesiredJob] = useState('');
  const [showDetailsButton, setShowDetailsButton] = useState(false);
  const initval: string[] = [];
  const [currentJobOptions, setCurrentJobOptions] = useState(initval);
  const [desiredJobOptions, setDesiredJobOptions] = useState(initval);
  const navigate = useNavigate();
  const location = useLocation();

  const isHeroDetails = location.pathname == '/hero-details';

  useEffect(() => {
    setCurrentJob(initialCurrentJob);
    setDesiredJob(initialDesiredJob);
  }, [initialCurrentJob, initialDesiredJob]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    formSubmitHandler(currentJob, desiredJob);
    setShowDetailsButton(true);
    if (isHeroDetails) {
      setShowDetailsButton(false);
      handleGoToDetails();
    }
  };

  const handleGoToDetails = () => {
    if (currentJob && desiredJob) {
      navigate('/hero-details', { state: { currentJob, desiredJob } });
    }
  };

  const getFilteredOccupation = async (
    newInputValue: string,
    stateSeter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const occupationsList = await searchOccupationsByTitle(newInputValue);
    stateSeter(occupationsList);
  };

  return (
    <form onSubmit={handleSubmit} className='form'>
      <Box
        component={'div'}
        sx={{ display: 'flex', justifyContent: 'space-evenly' }}
      >
        <Autocomplete
          value={currentJob}
          onChange={(event: any, newValue: string | null) => {
            if (newValue === null) return;
            setCurrentJob(newValue);
          }}
          freeSolo
          onInputChange={(event, newInputValue) => {
            if (newInputValue.length < 3) return;
            getFilteredOccupation(newInputValue, setCurrentJobOptions);
          }}
          id='current-job-autocomplite'
          options={currentJobOptions}
          autoComplete={true}
          autoSelect={true}
          filterOptions={(x) => x}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              className='input-form'
              required
              label='Current Job'
            />
          )}
        />
        <Autocomplete
          value={desiredJob}
          onChange={(event: any, newValue: string | null) => {
            if (newValue === null) return;
            setDesiredJob(newValue);
          }}
          freeSolo
          onInputChange={(event, newInputValue) => {
            if (newInputValue.length < 3) return;
            getFilteredOccupation(newInputValue, setDesiredJobOptions);
          }}
          id='current-job-autocomplite'
          options={desiredJobOptions}
          autoComplete={true}
          autoSelect={true}
          filterOptions={(x) => x}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              className='input-form'
              required
              label='Desired Job'
            />
          )}
        />
      </Box>
      <Box
        component={'div'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 2,
          gap: 2,
        }}
      >
        <Button
          type='submit'
          variant='contained'
          color='primary'
          className='button-form'
        >
          {isHeroDetails ? 'Compare Jobs' : 'Search Skills'}
        </Button>
        {showDetailsButton && !isHeroDetails && (
          <Button
            variant='outlined'
            color='secondary'
            className='button-form'
            onClick={handleGoToDetails}
          >
            Go to Details
          </Button>
        )}
      </Box>
    </form>
  );
};

export default JobForm;
