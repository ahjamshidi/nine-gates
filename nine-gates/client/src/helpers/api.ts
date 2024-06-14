import { Config } from '../constances/general';

// api.js
const BASE_URL = Config.BASE_URL;
const fetchJobSkills = async (endpoint:string, job:string) => {
  const response = await fetch(`${BASE_URL}/${endpoint}/${job}`);
  const skills = await response.json();
  return skills;
};

const fetchSkillDescription = async (skill:string):Promise<string> => {
  const skillTitle = encodeURIComponent(skill);
  const response = await fetch(`${BASE_URL}/skills/${skill}`);
  const data = await response.json();
  return data.description;
};

export { fetchJobSkills, fetchSkillDescription };
