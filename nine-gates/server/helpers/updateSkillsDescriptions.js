const axios = require('axios');
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect(
  'mongodb://root:root@127.0.0.1:27017/jobSkillsDB?authSource=admin',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  uri: { type: String, required: true, unique: true },
  skillType: String,
  description: String,
});

const Skill = mongoose.model('Skill', skillSchema);

async function updateSkillDescriptions() {
  const skills = await Skill.find({ description: { $exists: false } });

  for (const skill of skills) {
    try {
      const url = `https://ec.europa.eu/esco/api/resource/skill?uri=${encodeURIComponent(
        skill.uri
      )}&language=en`;
      const response = await axios.get(url);

      if (response.data) {
        const description = response.data.description?.en?.literal;
        await Skill.updateOne(
          { uri: skill.uri },
          { $set: { description: description } }
        );
        console.log('Skill description: ', description);
      }
    } catch (error) {
      console.error(
        `Error fetching description for skill ${skill.uri}:`,
        error
      );
    }
  }

  console.log('Skill descriptions update completed!');
  mongoose.connection.close();
}

// Run the update script
updateSkillDescriptions().catch((error) => {
  console.error('Error during skill descriptions update:', error);
  mongoose.connection.close();
});
