import { useState } from 'react'
import { fetchJobSkills } from './helpers/api';
import JobForm from './components/JobForm'
import MissingSkills from './components/MissingSkills'
import './App.css'
import Header from './components/Header'

const App = () => {
  const [currentJobSkills, setCurrentJobSkills] = useState([]);
  const [desiredJobSkills, setDesiredJobSkills] = useState([]);
  const [error, setError] = useState(null);

  const handleFetchCurrentJobSkills = async (currentJob) => {
    try {
      const skills = await fetchJobSkills('currentJob', currentJob);
      if (Array.isArray(skills)) {
        setCurrentJobSkills(skills);
        setError(null); // clear any previous error
      } else {
        setError('There are no skills matching your Job Title, sorry.');
      }
    } catch (err) {
      setError('An error occurred while fetching skills.');
    }
  };

  const handleFetchDesiredJobSkills = async (desiredJob) => {
    try {
      const skills = await fetchJobSkills('desiredJob', desiredJob);
      if (Array.isArray(skills)) {
        setDesiredJobSkills(skills);
        setError(null); // clear any previous error
      } else {
        setError('There are no skills matching your Job Title, sorry.');
      }
    } catch (err) {
      setError('An error occurred while fetching skills.');
    }
  };

  return (
    <div className="App">
      <Header />
      <div>
        <JobForm onSearchCurrentJob={handleFetchCurrentJobSkills} onSearchDesiredJob={handleFetchDesiredJobSkills} />
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="skills-lists">
        <MissingSkills currentSkills={currentJobSkills} desiredSkills={desiredJobSkills} />
      </div>
    </div>
  );
};

export default App;