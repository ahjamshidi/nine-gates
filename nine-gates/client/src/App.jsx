// import { useState } from 'react'

// import JobForm from './components/JobForm'
// import SkillsList from './components/SkillsList'

// import './App.css'

// const App = () => {
//   const [skills, setSkills] = useState([]);

//   const fetchSkills = async (job) => {
//     const response = await fetch(`http://localhost:5000/search/${job}`);
//     const skills = await response.json();
//     setSkills(skills);
//   };

//   return (
//     <div className="App">
//       <h1>Job Skills Finder</h1>
//       <JobForm onSearch={fetchSkills} />
//       <SkillsList skills={skills} />
//     </div>
//   );
// };


// export default App

import { useState } from 'react'

import JobForm from './components/JobForm'
import SkillsList from './components/SkillsList'

import './App.css'

const App = () => {
  const [currentJobSkills, setCurrentJobSkills] = useState([]);
  const [desiredJobSkills, setDesiredJobSkills] = useState([]);

  const fetchSkills = async (currentJob, desiredJob) => {
    const responseCurrentJob = await fetch(`http://localhost:5000/currentJob/${currentJob}`);
    const skillsCurrentJob = await responseCurrentJob.json();
    setCurrentJobSkills(skillsCurrentJob);

    const responseDesiredJob = await fetch(`http://localhost:5000/desiredJob/${desiredJob}`);
    const skillsDesiredJob = await responseDesiredJob.json();
    setDesiredJobSkills(skillsDesiredJob);
  };

  return (
    <div className="App">
      <h1>Job Skills Finder</h1>
      <div className="job-forms">
        <JobForm onSearch={fetchSkills} />
      </div>
      <div className="skills-lists">
        <SkillsList skills={currentJobSkills} />
        <SkillsList skills={desiredJobSkills} />
      </div>
    </div>
  );
};

export default App