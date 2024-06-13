import React from 'react';
import '../styles/SkillsList.css'

const MatchedSkills = ({ currentSkills, desiredSkills, onSkillClick }) => {
  const matchedSkills = desiredSkills.filter(skill => currentSkills.includes(skill));

  return (
    matchedSkills.length > 0 && (
      <div>
        <ul>
          {matchedSkills.map((skill, index) => (
            <li key={index} style={{ '--i': index }} onClick={() => onSkillClick(skill)}>{skill}</li>
          ))}
        </ul>
      </div>
    )
  );
};

export default MatchedSkills;