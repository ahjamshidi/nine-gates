const express = require('express');
const axios = require('axios');
const router = express.Router();


// getting the input from user and calling the API with that input.

router.get('/:job', async (req, res) => {
  const job = req.params.job;
  try {
    const response = await axios.get(`https://ec.europa.eu/esco/api/search?language=en&type=occupation&text=${job}`);
    const results = response.data._embedded.results;
    const firstUri = results.length > 0 ? results[0].uri : null;
    if (firstUri) {
      const encodedUri = encodeURIComponent(firstUri);
      const skillsResponse = await axios.get(`https://ec.europa.eu/esco/api/resource/occupation?uris=${encodedUri}&language=en`);
      res.json(skillsResponse.data);
    } else {
      res.json({ error: 'No occupations found for the given job.' });
    }
  } catch (error) {
    res.json({ error: error.toString() });
  }
});


module.exports = router;