import { Config } from '../constances/general';

// api.js
const BASE_URL = Config.BASE_URL;
export const fetchMissingJobSkills = async (
  currentJob: string,
  desireJob: string
) => {
  try {
    const params = new URLSearchParams({
      currentOccupationTitle: currentJob,
      desiredOccupationTitle: desireJob,
    });
    const response = await fetch(
      `${BASE_URL}/api/occupations/missing-skills?${params}`
    );
    const skills = await response.json();
    if (response?.ok) {
      return skills;
    } else {
      console.log(`HTTP Response Code: ${response?.status}`);
      return skills.message;
    }
  } catch (error) {
    return error;
  }
};
