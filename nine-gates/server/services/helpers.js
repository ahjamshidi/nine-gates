const axios = require("axios");
const Job = require("../models/Job");
const Skill = require("../models/Skill");

async function fetchJobSkills(job) {
  const response = await axios.get(
    `https://ec.europa.eu/esco/api/search?language=en&type=occupation&text=${job}`
  );
  const results = response.data._embedded.results;

  const firstUri = results.length > 0 ? results[0].uri : null;

  if (firstUri) {
    const encodedUri = encodeURIComponent(firstUri);
    const skillsResponse = await axios.get(
      `https://ec.europa.eu/esco/api/resource/occupation?uris=${encodedUri}&language=en`
    );
    const occupationData = skillsResponse.data._embedded[firstUri];
    const skills = occupationData._links.hasEssentialSkill;
    const skillTitles = skills.map((skill) => skill.title);
    const skillUris = skills.map((skill) => skill.uri);

    // Amir's implementation of injecting, into the Skill List of the Job Object, the description coming from the API Skills call
    for (let i = 0; i < skills.length; i++) {
      skills[i]["desc"] = await fetchSkillDescription(skills[i].uri);
    }

    // Save the job data to the database
    const jobData = new Job({
      jobTitle: job,
      essentialSkills: skillTitles,
      essentialSkillsUris: skillUris,
      firstUri: firstUri,
    });
    await jobData.save();

    // Fetch and save skill descriptions
    for (let uri of skillUris) {
      await fetchSkillDescription(uri);
    }

    return skillTitles;
  } else {
    throw new Error("No occupations found for the given job.");
  }
}

async function fetchSkillDescription(skillUri) {
  // Check if the skill is already in the database
  const skill = await Skill.findOne({ uri: skillUri });
  if (skill) {
    return skill.description;
  } else {
    // If not, fetch the skill data from the API
    const encodedUri = encodeURIComponent(skillUri);
    const response = await axios.get(
      `https://ec.europa.eu/esco/api/resource/skill?uris=${encodedUri}&language=en`
    );
    const skillData = response.data._embedded[skillUri];
    const description = skillData.description["en-us"].literal;
    const skillTitle = skillData.title;

    // Save the skill data to the database
    const newSkill = new Skill({
      skillTitle: skillTitle,
      uri: skillUri,
      description: description,
    });
    await newSkill.save();

    return description;
  }
}

module.exports = fetchSkillDescription;

module.exports = fetchJobSkills;
