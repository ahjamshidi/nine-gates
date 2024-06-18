import { useState } from 'react';
import { fetchMissingJobSkills } from '../helpers/api';
import JobForm from './JobForm';
import MissingSkills from './MissingSkills';
import '../styles/Dashboard.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Skill } from '../types/types';

const Dashboard = () => {
  const [missingSkillsList, setMissingSkillsList] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null); // New addition
  const [error, setError] = useState<string | null>(null);

  const getMissingSkills = async (currentJob: string, desiredJob: string) => {
    const skills = await fetchMissingJobSkills(currentJob, desiredJob);
    if (skills.data?.missingEssentialSkills.length > 0) {
      setMissingSkillsList(skills.data.missingEssentialSkills);
      setError(null);
    } else {
      setError(skills);
    }
  };

  const handleSkillClick = async (skill: string): Promise<void> => {
    try {
      const selectedSkillData = missingSkillsList.filter((el) => {
        return el.title === skill && el;
      });
      if (selectedSkillData.length > 0) setSelectedSkill(selectedSkillData[0]);
    } catch (err) {
      console.error(err);
      setError('CANT GET the skill description.');
    }
  };

  return (
    <div className='App'>
      <div>
        <JobForm formSubmitHandler={getMissingSkills} />
      </div>
      {error && <div className='error-message'>{error}</div>}
      <div className='skills-lists'>
        <MissingSkills
          missingSkillsList={missingSkillsList}
          onSkillClick={handleSkillClick}
        />
      </div>
      <Dialog open={!!selectedSkill} onClose={() => setSelectedSkill(null)}>
        <DialogTitle>{selectedSkill ? selectedSkill.title : ''}</DialogTitle>
        <DialogContent>
          {selectedSkill ? selectedSkill.description : ''}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
