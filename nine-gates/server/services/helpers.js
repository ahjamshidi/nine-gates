const axios = require('axios');
const Job = require('../models/Job');

async function fetchJobSkills(job) {
  const response = await axios.get(`https://ec.europa.eu/esco/api/search?language=en&type=occupation&text=${job}`);
  const results = response.data._embedded.results;
  const firstUri = results.length > 0 ? results[0].uri : null;

  if (firstUri) {
    const encodedUri = encodeURIComponent(firstUri);
    const skillsResponse = await axios.get(`https://ec.europa.eu/esco/api/resource/occupation?uris=${encodedUri}&language=en`);
    const occupationData = skillsResponse.data._embedded[firstUri];
    const skills = occupationData._links.hasEssentialSkill;
    const skillTitles = skills.map(skill => skill.title);

    // Save the job data to the database
    const jobData = new Job({
      jobTitle: job,
      essentialSkills: skillTitles,
      firstUri: firstUri
    });
    await jobData.save();

    return skillTitles;
  } else {
    throw new Error('No occupations found for the given job.');
  }
}

module.exports = fetchJobSkills;