import React from 'react';
import '../styles/SkillsList.css';
import { Skill } from '../types/types';

const SkillsList = ({
  skillsList,
  onSkillClick,
}: {
  skillsList: Skill[];
  onSkillClick: (skill: Skill) => void;
}) => {
  return skillsList.length > 0 ? (
    <div>
      <ul>
        {skillsList.map((skill, index) => (
          <li
            key={index}
            style={{ textAlign: 'center', display: 'block' }}
            onClick={() => onSkillClick(skill)}
          >
            {skill.title}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div></div>
  );
};

export default SkillsList;
