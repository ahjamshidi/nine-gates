import React from 'react';
import '../styles/SkillsList.css';

const MissingSkills = ({
  currentSkills,
  desiredSkills,
  onSkillClick,
}: {
  currentSkills: string[];
  desiredSkills: string[];
  onSkillClick: (skill: string) => Promise<void>;
}) => {
  const missingSkills = desiredSkills.filter(
    (skill) => !currentSkills.includes(skill)
  );

  return missingSkills.length > 0 ? (
    <div>
      <ul>
        {missingSkills.map((skill, index) => (
          <li
            key={index}
            style={{ '--i': index } as React.CSSProperties}
            onClick={() => onSkillClick(skill)}
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div></div>
  );
};

export default MissingSkills;
