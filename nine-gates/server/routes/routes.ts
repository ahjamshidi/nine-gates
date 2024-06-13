import express from 'express';
import { getCurrentJob, getDesiredJob } from '../controllers/jobController';
import { getSkillDescription } from '../controllers/skillController';

const router = express.Router();

router.get('/currentJob/:jobTitle', getCurrentJob);
router.get('/desiredJob/:jobTitle', getDesiredJob);
router.get('/skills/:skillTitle', getSkillDescription);

export default router;
