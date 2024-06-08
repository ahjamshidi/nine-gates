// api.js
const fetchJobSkills = async (endpoint, job) => {
  const response = await fetch(`http://localhost:5000/${endpoint}/${job}`);
  const skills = await response.json();
  return skills;
};

export { fetchJobSkills };