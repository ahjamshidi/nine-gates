const express = require('express');
const jobController = require('../controllers/jobController');
const router = express.Router();

router.get('/:job', jobController.getJobSkills);


module.exports = router;