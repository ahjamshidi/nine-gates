import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const JobForm = ({ onSearchCurrentJob, onSearchDesiredJob }) => {
  const [currentJob, setCurrentJob] = useState('');
  const [desiredJob, setDesiredJob] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchCurrentJob(currentJob);
    onSearchDesiredJob(desiredJob);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Current Job"
        value={currentJob}
        onChange={(e) => setCurrentJob(e.target.value)}
        required
      />
      <TextField
        label="Desired Job"
        value={desiredJob}
        onChange={(e) => setDesiredJob(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Search
      </Button>
    </form>
  );
};

export default JobForm;