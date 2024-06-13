import { useState } from 'react';
import { fetchJobSkills } from '../helpers/api';
import { fetchSkillDescription } from '../helpers/api';
import JobForm from './JobForm';
import MissingSkills from './MissingSkills';
import '../styles/Dashboard.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Skill } from '../types/types';

const App = () => {
  const [currentJobSkills, setCurrentJobSkills] = useState<string[]>([]);
  const [desiredJobSkills, setDesiredJobSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill|null>(null); // New addition
  const [error, setError] = useState<string | null>(null);

  const handleFetchCurrentJobSkills = async (currentJob: string) => {
    try {
      const skills = await fetchJobSkills('currentJob', currentJob);
      if (Array.isArray(skills)) {
        setCurrentJobSkills(skills);
        setError(null);
      } else {
        setError('There are no skills matching your Job Title, sorry.');
      }
    } catch (err) {
      setError('An error occurred while fetching skills.');
    }
  };

  const handleFetchDesiredJobSkills = async (desiredJob: string) => {
    try {
      const skills = await fetchJobSkills('desiredJob', desiredJob);
      if (Array.isArray(skills)) {
        setDesiredJobSkills(skills);
        setError(null);
      } else {
        setError('There are no skills matching your Job Title, sorry.');
      }
    } catch (err) {
      setError('An error occurred while fetching skills.');
    }
  };


  // Adding new functionality
  const handleSkillClick = async (skill: string):Promise<void> => {
    try {
      const description = await fetchSkillDescription(skill);
      setSelectedSkill({ name: skill, description }); // Set the selected skill object
    } catch (err) {
      console.error(err);
      setError('CANT GET the skill description.');
    }
  };

  return (
    <div className="App">
      <div>
        <JobForm
          onSearchCurrentJob={handleFetchCurrentJobSkills}
          onSearchDesiredJob={handleFetchDesiredJobSkills}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="skills-lists">
        <MissingSkills
          currentSkills={currentJobSkills}
          desiredSkills={desiredJobSkills}
          onSkillClick={handleSkillClick}
        />
      </div>
      <Dialog open={!!selectedSkill} onClose={() => setSelectedSkill(null)}>
        <DialogTitle>{selectedSkill ? selectedSkill.name : ''}</DialogTitle>
        <DialogContent>
          {selectedSkill ? selectedSkill.description : ''}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
