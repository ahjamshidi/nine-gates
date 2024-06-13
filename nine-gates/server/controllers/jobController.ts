import { Request, Response } from 'express';
import { fetchJobSkills } from '../services/helpers';

const getCurrentJob = async (req: Request, res: Response): Promise<void> => {
  const job = req.params.jobTitle;
  try {
    const skills = await fetchJobSkills(job);
    res.json(skills);
  } catch (error: any) {
    res.status(500).json({ error: error.toString() });
  }
};

const getDesiredJob = async (req: Request, res: Response): Promise<void> => {
  const job = req.params.jobTitle;
  try {
    const skills = await fetchJobSkills(job);
    res.json(skills);
  } catch (error: any) {
    res.status(500).json({ error: error.toString() });
  }
};

export { getCurrentJob, getDesiredJob };
