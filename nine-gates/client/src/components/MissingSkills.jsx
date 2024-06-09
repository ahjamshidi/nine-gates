import React from 'react';
import '../styles/SkillsList.css'

const MissingSkills = ({ currentSkills, desiredSkills }) => {
  const missingSkills = desiredSkills.filter(skill => !currentSkills.includes(skill));

  return (
    missingSkills.length > 0 && (
      <div>
        <ul>
          {missingSkills.map((skill, index) => (
            <li key={index} style={{ '--i': index }}>{skill}</li>
          ))}
        </ul>
      </div>
    )
  );
};

export default MissingSkills;