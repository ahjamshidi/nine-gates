// api.js
const fetchJobSkills = async (endpoint, job) => {
  const response = await fetch(`http://localhost:5000/${endpoint}/${job}`);
  const skills = await response.json();
  return skills;
};

const fetchSkillDescription = async (skill) => {
  console.log('fetchSkillDescription called with skill:', skill);
  const skillTitle = encodeURIComponent(skill);
  console.log('Encoded skill title:', skill);
  const response = await fetch(`http://localhost:5000/skills/${skill}`);
  const data = await response.json();
  console.log('Response data:', data);
  return data.description;
};

export { fetchJobSkills, fetchSkillDescription };