import { useState } from "react";
import { fetchJobSkills } from "../helpers/api";
import { fetchSkillDescription } from "../helpers/api";
import JobForm from "./JobForm";
import MissingSkills from "./MissingSkills";
import MatchedSkills from "./MatchedSkills";
import "../styles/Dashboard.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from '@mui/material/Typography';

const App = () => {
  const [currentJobSkills, setCurrentJobSkills] = useState([]);
  const [desiredJobSkills, setDesiredJobSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] =
    useState(null); // New addition
  const [error, setError] = useState(null);



  const handleFetchCurrentJobSkills = async (currentJob) => {
    try {
      const skills = await fetchJobSkills("currentJob", currentJob);
      if (Array.isArray(skills)) {
        setCurrentJobSkills(skills);
        setError(null);
      } else {
        setError("There are no skills matching your Job Title, sorry.");
      }
    } catch (err) {
      setError("An error occurred while fetching skills.");
    }
  };

  const handleFetchDesiredJobSkills = async (desiredJob) => {
    try {
      const skills = await fetchJobSkills("desiredJob", desiredJob);
      if (Array.isArray(skills)) {
        setDesiredJobSkills(skills);
        setError(null);
      } else {
        setError("There are no skills matching your Job Title, sorry.");
      }
    } catch (err) {
      setError("An error occurred while fetching skills.");
    }
  };

  const calculateCommonSkills = () => {
    const currentSkillsTitles = currentJobSkills.map((skill) => skill.title);
    const desiredSkillsTitles = desiredJobSkills.map((skill) => skill.title);
    const commonSkills = currentSkillsTitles.filter((skill) =>
      desiredSkillsTitles.includes(skill)
    );
    return commonSkills.length;
  };

  // Adding new functionality
  const handleSkillClick = async (skill) => {
    try {
      const description = await fetchSkillDescription(skill);
      setSelectedSkill({ name: skill, description }); // Set the selected skill object
    } catch (err) {
      console.error(err);
      setError("CANT GET the skill description.");
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
      {/* {currentJobSkills.length > 0 && desiredJobSkills.length > 0 && (

        <div class="MuiTypography-root MuiTypography-body1 css-1dnox73-MuiTypography-root">
          You currently hold {calculateCommonSkills()} skills
          in your current skill set that are also present in your desired job.
          Just focus on the following Missing Skills:
        </div>
      )} */}
      <div className="skills-lists">
        <MissingSkills
          currentSkills={currentJobSkills}
          desiredSkills={desiredJobSkills}
          onSkillClick={handleSkillClick}
        />
      </div>
      {/* <div className="skills-lists">
        <MatchedSkills
          currentSkills={currentJobSkills}
          desiredSkills={desiredJobSkills}
          onSkillClick={handleSkillClick}
        />
      </div> */}
      <Dialog
        open={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
      >
        <DialogTitle>{selectedSkill ? selectedSkill.name : ""}</DialogTitle>
        <DialogContent>{selectedSkill ? selectedSkill.description : ""}</DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
