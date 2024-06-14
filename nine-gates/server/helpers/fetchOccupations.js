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

const occupationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  uri: { type: String, required: true, unique: true },
  description: String,
  preferredLabel: String,
  alternativeLabel: [String],
  code: String,
  essentialSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  optionalSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
});

const Skill = mongoose.model('Skill', skillSchema);
const Occupation = mongoose.model('Occupation', occupationSchema);

// Fetch data from ESCO API
async function fetchOccupations() {
  let offset = 0;
  let hasNext = true;

  while (hasNext) {
    try {
      const url = `https://ec.europa.eu/esco/api/resource/occupation?isInScheme=http://data.europa.eu/esco/concept-scheme/occupations&language=en&offset=${offset}&limit=1`;
      const response = await axios.get(url);

      if (response.data && response.data._embedded) {
        const embeddedData = response.data._embedded;
        const occupationKeys = Object.keys(embeddedData).filter((key) =>
          key.includes('occupation')
        );
        const occupations = occupationKeys.map((key) => embeddedData[key]);

        for (const occupation of occupations) {
          const { essentialSkills, optionalSkills } = await fetchSkills(
            occupation
          );

          const essentialSkillRefs = await Promise.all(
            essentialSkills.map(async (skill) => {
              const existingSkill = await Skill.findOne({ uri: skill.uri });
              if (existingSkill) {
                return existingSkill._id;
              } else {
                const newSkill = new Skill(skill);
                await newSkill.save();
                return newSkill._id;
              }
            })
          );

          const optionalSkillRefs = await Promise.all(
            optionalSkills.map(async (skill) => {
              const existingSkill = await Skill.findOne({ uri: skill.uri });
              if (existingSkill) {
                return existingSkill._id;
              } else {
                const newSkill = new Skill(skill);
                await newSkill.save();
                return newSkill._id;
              }
            })
          );

          const occupationData = {
            title: occupation.title,
            uri: occupation.uri,
            description: occupation.description?.en?.literal,
            preferredLabel: occupation.preferredLabel?.en,
            alternativeLabel: occupation.alternativeLabel?.en || [],
            code: occupation.code,
            essentialSkills: essentialSkillRefs,
            optionalSkills: optionalSkillRefs,
          };

          console.log('occupationData: ', occupationData);

          // Save to MongoDB
          await Occupation.updateOne(
            { uri: occupation.uri },
            { $set: occupationData },
            { upsert: true }
          );

          console.log('Occupation saved:', {
            title: occupationData.title,
            uri: occupationData.uri,
            essentialSkills: occupationData.essentialSkills,
            optionalSkills: occupationData.optionalSkills,
          });
        }

        console.log('next: ', response.data._links.next);

        if (response.data._links && response.data._links.next) {
          offset++;
        } else {
          hasNext = false;
        }
      } else {
        hasNext = false;
      }
    } catch (error) {
      console.error(`Error fetching data at offset ${offset}:`, error);
      offset++;
    }
  }

  console.log('Seeding completed!');
  mongoose.connection.close();
}

// Fetch skills for an occupation
async function fetchSkills(occupation) {
  const essentialSkills = [];
  const optionalSkills = [];

  if (occupation._links.hasEssentialSkill) {
    for (const skillLink of occupation._links.hasEssentialSkill) {
      const skill = {
        title: skillLink.title,
        uri: skillLink.uri,
        skillType: skillLink.skillType.split('/').pop(),
      };
      essentialSkills.push(skill);
    }
  }

  if (occupation._links.hasOptionalSkill) {
    for (const skillLink of occupation._links.hasOptionalSkill) {
      const skill = {
        title: skillLink.title,
        uri: skillLink.uri,
        skillType: skillLink.skillType.split('/').pop(),
      };
      optionalSkills.push(skill);
    }
  }

  return { essentialSkills, optionalSkills };
}

// Run the seeding script
fetchOccupations().catch((error) => {
  console.error('Error during seeding:', error);
  mongoose.connection.close();
});
