const express = require('express');
const jobController = require('../controllers/jobController');
const router = express.Router();

// router.get('/:job', jobController.getJobSkills);

// Endpoint for current job
router.get('/currentJob/:jobTitle', jobController.getCurrentJob);

// Endpoint for desired job
router.get('/desiredJob/:jobTitle', jobController.getDesiredJob);


module.exports = router;