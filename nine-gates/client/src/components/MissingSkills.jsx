import React from 'react';
import '../styles/SkillsList.css'

const MissingSkills = ({ currentSkills, desiredSkills, onSkillClick }) => {
  const missingSkills = desiredSkills.filter(skill => !currentSkills.includes(skill));

  return (
    missingSkills.length > 0 && (
      <div>
        <ul>
          {missingSkills.map((skill, index) => (
            <li key={index} style={{ '--i': index }} onClick={() => onSkillClick(skill)}>{skill}</li>
          ))}
        </ul>
      </div>
    )
  );
};

export default MissingSkills;