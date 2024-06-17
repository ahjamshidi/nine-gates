import { Request, Response } from 'express';
import OccupationService from '../services/occupationService';
import { IOccupation } from '@/models/occupation';

class OccupationController {
  async compareDetails(req: Request, res: Response): Promise<Response> {
    const { currentOccupationTitle, desiredOccupationTitle } = req.query;
    if (!currentOccupationTitle || !desiredOccupationTitle) {
      return res.status(400).json({
        data: {},
        message: 'Current and desired occupation Ids are required',
        error: 'Invalid input',
      });
    }
    try {
      const results = await OccupationService.compaireCurrentAndDesireJobs(
        currentOccupationTitle as string,
        desiredOccupationTitle as string
      );

      return res.status(200).json({
        data: {
          results,
        },
        message: 'Skills comparison successful',
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
  async searchOccupation(req: Request, res: Response): Promise<Response> {
    const { searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(400).json({
        data: {},
        message: 'Search query is required',
        error: 'Invalid input',
      });
    }

    try {
      const byTitleResults = await OccupationService.searchOccupationByTitle(
        searchQuery as string
      );
      const bySkillResults = await OccupationService.searchOccupationBySkill(
        searchQuery as string
      );

      // Create a Map to ensure unique entries based on occupation ID
      const occupationMap = new Map<string, IOccupation>();

      if (byTitleResults) {
        byTitleResults.forEach((occupation: IOccupation) => {
          occupationMap.set(
            (occupation._id as unknown as string).toString(),
            occupation
          );
        });
      }

      if (bySkillResults) {
        bySkillResults.forEach((occupation) => {
          if (
            !occupationMap.has((occupation._id as unknown as string).toString())
          ) {
            occupationMap.set(
              (occupation._id as unknown as string).toString(),
              occupation
            );
          }
        });
      }

      // Convert the map back to an array
      const results = Array.from(occupationMap.values());

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
        message: 'Error searching occupations by title',
        error: (error as Error).message,
      });
    }
  }

  async searchOccupationBySkill(
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
      const results = await OccupationService.searchOccupationBySkill(
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
        message: 'Error searching occupations by skill',
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
