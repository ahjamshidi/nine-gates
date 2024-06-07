import React from 'react';

const SkillsList = ({ skills }) => {
  return (
    <ul>
      {skills.map((skill, index) => (
        <li key={index}>{skill}</li>
      ))}
    </ul>
  );
};

export default SkillsList;