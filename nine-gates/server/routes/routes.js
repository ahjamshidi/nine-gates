const express = require('express');
const jobController = require('../controllers/jobController');
const skillController = require('../controllers/skillController');
const router = express.Router();

router.get('/currentJob/:jobTitle', jobController.getCurrentJob);
router.get('/desiredJob/:jobTitle', jobController.getDesiredJob);
router.get('/skills/:skillTitle', skillController.getSkillDescription);


module.exports = router;