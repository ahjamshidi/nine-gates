const axios = require('axios');
const mongoose = require('mongoose');

// MongoDB connection
const dbUri = null; // substitute by the db connection string
if (!dbUri) {
  throw new Error('DATABASE_URI environment variable is not defined');
}

// MongoDB connection
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  uri: { type: String, required: true, unique: true },
  skillType: String,
  description: String,
});

const occupationSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
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

          // Save to MongoDB
          await Occupation.updateOne(
            { uri: occupation.uri },
            { $set: occupationData },
            { upsert: true }
          );

          console.log('Occupation saved:', {
            title: occupationData.title,
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

// Fetch skill descriptions from ESCO API
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
        console.log('Skill description updated:', description);
      }
    } catch (error) {
      console.error(
        `Error fetching description for skill ${skill.uri}:`,
        error
      );
    }
  }

  console.log('Skill descriptions update completed!');
}

// Run the seeding and update scripts
(async () => {
  try {
    await fetchOccupations();
    await updateSkillDescriptions();
    mongoose.connection.close();
  } catch (error) {
    console.error('Error during seeding or updating:', error);
    mongoose.connection.close();
  }
})();
