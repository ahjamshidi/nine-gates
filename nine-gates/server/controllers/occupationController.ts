import { Request, Response } from 'express';
import OccupationService from '../services/occupationService';

class OccupationController {
  async getMissingSkills(req: Request, res: Response): Promise<Response> {
    const { currentOccupationTitle, desiredOccupationTitle } = req.query;

    if (!currentOccupationTitle || !desiredOccupationTitle) {
      return res.status(400).json({
        data: {},
        message: 'Current and desired occupation titles are required',
        error: 'Invalid input',
      });
    }

    try {
      const { missingEssentialSkills, missingOptionalSkills } =
        await OccupationService.findMissingSkills(
          currentOccupationTitle as string,
          desiredOccupationTitle as string
        );

      return res.status(200).json({
        data: {
          missingEssentialSkills,
          missingOptionalSkills,
        },
        message: 'Skills comparison successful',
        error: '',
      });
    } catch (error) {
      return res.status(500).json({
        data: {},
        message: 'Error comparing occupations',
        error: (error as Error).message,
      });
    }
  }
}

export default new OccupationController();
