const axios = require('axios');
const Skill = require('../models/Skill');

exports.getSkillDescription = async (req, res) => {
  const { skillTitle } = req.params;
  try {
    let skill = await Skill.findOne({ skillTitle: skillTitle });
    if (!skill) {
      // If the skill is not found in the database, fetch it from the API
      const response = await axios.get(
        `https://ec.europa.eu/esco/api/search?language=en&type=skill&text=${encodeURIComponent(skillTitle)}`
      );
      const results = response.data._embedded.results;
      const firstUri = results.length > 0 ? results[0].uri : null;

      if (firstUri) {
        const encodedUri = encodeURIComponent(firstUri);
        const skillResponse = await axios.get(
          `https://ec.europa.eu/esco/api/resource/skill?uris=${encodedUri}&language=en`
        );
        const skillData = skillResponse.data._embedded[firstUri];
        const description = skillData.description["en-us"].literal;

        // Check if a skill with the same uri already exists
        skill = await Skill.findOne({ uri: firstUri });
        if (skill) {
          // If the skill exists, update it with the new data
          skill.skillTitle = skillTitle;
          skill.description = description;
        } else {
          // If the skill does not exist, create a new skill
          skill = new Skill({
            skillTitle: skillTitle,
            uri: firstUri,
            description: description,
          });
        }
        await skill.save();
      } else {
        return res.status(404).json({ error: 'Skill not found' });
      }
    }
    res.json({ description: skill.description });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};