import { Router } from 'express';
import OccupationController from '../controllers/occupationController';

const router = Router();

router.get('/search/title', OccupationController.searchOccupationByTitle);
router.get('/search/skill', OccupationController.searchOccupationBySkill);
router.get('/missing-skills', OccupationController.getMissingSkills);

export default router;
