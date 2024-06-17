import React, { FormEvent, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { searchOccupationsByTitle } from '../helpers/api';
import '../styles/JobForm.css';
// todo fix prop type
const JobForm = ({
  formSubmitHandler,
}: {
  formSubmitHandler: (currentJob: string, desiredJob: string) => void;
}) => {
  const [currentJob, setCurrentJob] = useState('');
  const [desiredJob, setDesiredJob] = useState('');
  const initval: string[] = [];
  const [currentJobOptions, setCurrentJobOptions] = useState(initval);
  const [desiredJobOptions, setDesiredJobOptions] = useState(initval);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    formSubmitHandler(currentJob, desiredJob);
  };
  const getFilteredOccupation = async (
    newInputValue: string,
    stateSeter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const occupationsList = await searchOccupationsByTitle(newInputValue);
    stateSeter(occupationsList);
  };
  return (
    <form onSubmit={handleSubmit} className="form">
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
          id="current-job-autocomplite"
          options={currentJobOptions}
          autoComplete={true}
          autoSelect={true}
          filterOptions={(x) => x}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              className="input-form"
              required
              label="Current Job"
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
          id="current-job-autocomplite"
          options={desiredJobOptions}
          autoComplete={true}
          autoSelect={true}
          filterOptions={(x) => x}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              className="input-form"
              required
              label="Desired Job"
            />
          )}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="button-form"
        sx={{ mt: 2 }}
      >
        Search Skills
      </Button>
    </form>
  );
};

export default JobForm;
