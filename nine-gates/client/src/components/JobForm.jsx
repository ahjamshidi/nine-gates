import React, { useState } from 'react';

const JobForm = ({ onSearch }) => {
  const [job, setJob] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(job);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={job} onChange={(e) => setJob(e.target.value)} required />
      <button type="submit">Search</button>
    </form>
  );
};

export default JobForm;