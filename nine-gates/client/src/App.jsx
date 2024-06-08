import { useState } from 'react'

import JobForm from './components/JobForm'
import SkillsList from './components/SkillsList'
import MissingSkills from './components/MissingSkills'

import './App.css'
import Header from './components/Header'

const App = () => {
  const [currentJobSkills, setCurrentJobSkills] = useState([]);
  const [desiredJobSkills, setDesiredJobSkills] = useState([]);

  const fetchCurrentJobSkills = async (currentJob) => {
    const response = await fetch(`http://localhost:5000/currentJob/${currentJob}`);
    const skills = await response.json();
    setCurrentJobSkills(skills);
  };

  const fetchDesiredJobSkills = async (desiredJob) => {
    const response = await fetch(`http://localhost:5000/desiredJob/${desiredJob}`);
    const skills = await response.json();
    setDesiredJobSkills(skills);
  };

  return (
    <div className="App">
      <Header />
      <div className="job-forms">
        <JobForm onSearchCurrentJob={fetchCurrentJobSkills} onSearchDesiredJob={fetchDesiredJobSkills} />
      </div>
      <div className="skills-lists">
        <SkillsList skills={currentJobSkills} />
        <SkillsList skills={desiredJobSkills} />
        <MissingSkills currentSkills={currentJobSkills} desiredSkills={desiredJobSkills} />
      </div>
    </div>
  );
};

export default App