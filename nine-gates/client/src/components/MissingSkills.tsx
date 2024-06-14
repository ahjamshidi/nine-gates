import React from 'react';
import '../styles/SkillsList.css';
import { Skill } from '../types/types';

const MissingSkills = ({
  missingSkillsList,
  onSkillClick,
}: {
  missingSkillsList: Skill[];
  onSkillClick: (skill: string) => Promise<void>;
}) => {
  return missingSkillsList.length > 0 ? (
    <div>
      <ul>
        {missingSkillsList.map((skill, index) => (
          <li
            key={index}
            style={{ '--i': index } as React.CSSProperties}
            onClick={() => onSkillClick(skill.title)}
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

export default MissingSkills;
