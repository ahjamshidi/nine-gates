import React from 'react';

const MissingSkills = ({ currentSkills, desiredSkills }) => {
  const missingSkills = desiredSkills.filter(skill => !currentSkills.includes(skill));

  return (
    <div>
      <h2>Missing Skills</h2>
      <ul>
        {missingSkills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default MissingSkills;