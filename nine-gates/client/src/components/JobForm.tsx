import React, { FormEvent, useState } from 'react';
import { TextField, Button } from '@mui/material';
import '../styles/JobForm.css';
// todo fix prop type
const JobForm = ({ onSearchCurrentJob, onSearchDesiredJob }:{onSearchCurrentJob:any, onSearchDesiredJob:any}) => {
  const [currentJob, setCurrentJob] = useState('');
  const [desiredJob, setDesiredJob] = useState('');

  const handleSubmit = (event:FormEvent) => {
    event.preventDefault();
    onSearchCurrentJob(currentJob);
    onSearchDesiredJob(desiredJob);
  };

  return (
    <form onSubmit={handleSubmit} className='form'>
      <TextField
        label="Current Job"
        value={currentJob}
        onChange={(e) => setCurrentJob(e.target.value)}
        required
        className="input-form"
      />
      <TextField
        className="input-form"
        label="Desired Job"
        value={desiredJob}
        onChange={(e) => setDesiredJob(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary" className="button-form">
        Search Skills
      </Button>
    </form>
  );
};

export default JobForm;