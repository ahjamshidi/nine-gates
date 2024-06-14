import { Request, Response } from 'express';
import OccupationService from '../services/occupationService';

class OccupationController {
  async searchOccupationByTitle(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(400).json({
        data: {},
        message: 'Search query is required',
        error: 'Invalid input',
      });
    }

    try {
      const results = await OccupationService.searchOccupationByTitle(
        searchQuery as string
      );

      return res.status(200).json({
        data: results,
        message: 'Search successful',
        error: '',
      });
    } catch (error) {
      return res.status(500).json({
        data: {},
        message: 'Error searching occupations',
        error: (error as Error).message,
      });
    }
  }

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
