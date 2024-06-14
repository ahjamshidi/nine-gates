import { Router } from 'express';
import OccupationController from '../controllers/occupationController';

const router = Router();

router.get('/missing-skills', OccupationController.getMissingSkills);

export default router;
