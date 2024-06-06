const axios = require('axios');
const Job = require('../models/Job');


exports.getJobSkills = async (req, res) => {
  const job = req.params.job;
  try {
    const response = await axios.get(`https://ec.europa.eu/esco/api/search?language=en&type=occupation&text=${job}`);
    const results = response.data._embedded.results;
   // console.log('***************here is Results: ',results)
    const firstUri = results.length > 0 ? results[0].uri : null;

    // let firstUri = null;
    // for (let i = 0; i < results.length; i++) {
    //   if (results[i].title.toLowerCase() === job.toLowerCase()) {
    //     firstUri = results[i].uri;
    //     break;
    //   }
    // }

    //console.log('this is the URIO')

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

      res.json(skillTitles);
    } else {
      res.json({ error: 'No occupations found for the given job.' });
    }
  } catch (error) {
    res.json({ error: error.toString() });
  }
};