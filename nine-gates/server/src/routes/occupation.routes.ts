import { Router } from 'express';
import OccupationController from '../controllers/occupationController';

const router = Router();

router.get('/search', OccupationController.searchOccupation);
router.get('/search/title', OccupationController.searchOccupationByTitle);
router.get('/search/skill', OccupationController.searchOccupationBySkill);
router.get('/missing-skills', OccupationController.getMissingSkills);
router.get('/compare-details', OccupationController.compareDetails);

export default router;
