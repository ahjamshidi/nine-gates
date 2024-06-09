const fetchJobSkills = require ('../services/helpers')

exports.getCurrentJob = async (req, res) => {
  const job = req.params.jobTitle;
  try {
    const skills = await fetchJobSkills(job);
    res.json(skills);
  } catch (error) {
    res.json({ error: error.toString() });
  }
};

exports.getDesiredJob = async (req, res) => {
  const job = req.params.jobTitle;
  try {
    const skills = await fetchJobSkills(job);
    res.json(skills);
  } catch (error) {
    res.json({ error: error.toString() });
  }
};