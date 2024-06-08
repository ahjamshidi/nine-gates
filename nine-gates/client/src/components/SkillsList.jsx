import React from 'react';
import '../styles/SkillsList.css'

const SkillsList = ({ skills }) => {
  return (
    <ul>
      {skills.map((skill, index) => (
        <li key={index} style={{ '--i': index + 1 }}>{skill}</li>
      ))}
    </ul>
  );
};

export default SkillsList;