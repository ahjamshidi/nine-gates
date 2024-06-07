import React, { useState } from 'react';

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
      <label>
        Current Job:
        <input type="text" value={currentJob} onChange={(e) => setCurrentJob(e.target.value)} required />
      </label>
      <label>
        Desired Job:
        <input type="text" value={desiredJob} onChange={(e) => setDesiredJob(e.target.value)} required />
      </label>
      <button type="submit">Search</button>
    </form>
  );
};

export default JobForm;