import { useState } from 'react'

import JobForm from './components/JobForm'
import SkillsList from './components/SkillsList'

import './App.css'

const App = () => {
  const [skills, setSkills] = useState([]);

  const fetchSkills = async (job) => {
    const response = await fetch(`http://localhost:5000/search/${job}`);
    const skills = await response.json();
    setSkills(skills);
  };

  return (
    <div className="App">
      <h1>Job Skills Finder</h1>
      <JobForm onSearch={fetchSkills} />
      <SkillsList skills={skills} />
    </div>
  );
};


export default App
