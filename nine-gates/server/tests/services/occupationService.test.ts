import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OccupationService from '../../src/services/occupationService';
import Occupation, { IOccupation } from '../../src/models/occupation';
import Skill, { ISkill } from '../../src/models/skill';

dotenv.config();

jest.mock('../../src/models/occupation');
jest.mock('../../src/models/skill');

describe('OccupationService', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URI as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchOccupationByTitle', () => {
    it('should return occupations matching the search query', async () => {
      const mockOccupation: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Developer',
        preferredLabel: 'Developer',
        alternativeLabel: ['Coder', 'Programmer'],
      };

      (Occupation.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([mockOccupation]),
      });

      const results = await OccupationService.searchOccupationByTitle(
        'developer'
      );
      expect(results).toEqual([mockOccupation]);
      expect(Occupation.find).toHaveBeenCalledWith({
        $or: [
          { title: /developer/i },
          { preferredLabel: /developer/i },
          { alternativeLabel: { $elemMatch: { $regex: /developer/i } } },
        ],
      });
    });

    it('should return an empty array if no occupations match the search query', async () => {
      (Occupation.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([]),
      });

      const results = await OccupationService.searchOccupationByTitle(
        'nonexistent'
      );
      expect(results).toEqual([]);
      expect(Occupation.find).toHaveBeenCalledWith({
        $or: [
          { title: /nonexistent/i },
          { preferredLabel: /nonexistent/i },
          { alternativeLabel: { $elemMatch: { $regex: /nonexistent/i } } },
        ],
      });
    });

    it('should handle regex special characters in search query', async () => {
      const mockOccupation: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'C++ Developer',
        preferredLabel: 'C++ Developer',
        alternativeLabel: ['C++ Coder'],
      };

      (Occupation.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([mockOccupation]),
      });

      const results = await OccupationService.searchOccupationByTitle('C++');
      expect(results).toEqual([mockOccupation]);
      expect(Occupation.find).toHaveBeenCalledWith({
        $or: [
          { title: /C\+\+/i },
          { preferredLabel: /C\+\+/i },
          { alternativeLabel: { $elemMatch: { $regex: /C\+\+/i } } },
        ],
      });
    });

    it('should throw an error if Occupation.find fails', async () => {
      (Occupation.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(
        OccupationService.searchOccupationByTitle('developer')
      ).rejects.toThrow('Database error');
    });
  });

  describe('searchOccupationBySkill', () => {
    it('should return occupations matching the search query', async () => {
      const mockSkill: Partial<ISkill> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'developer',
      };

      const mockOccupation: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Developer',
        preferredLabel: 'Developer',
        alternativeLabel: ['Coder', 'Programmer'],
      };

      (Skill.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([mockSkill]),
      });

      (Occupation.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([mockOccupation]),
      });

      const results = await OccupationService.searchOccupationBySkill(
        'developer'
      );
      expect(results).toEqual([mockOccupation]);
      expect(Skill.find).toHaveBeenCalledWith({ title: /developer/i });
      expect(Occupation.find).toHaveBeenCalledWith({
        $or: [
          { essentialSkills: { $in: [mockSkill._id] } },
          { optionalSkills: { $in: [mockSkill._id] } },
        ],
      });
    });

    it('should return an empty array if no occupations match the search query', async () => {
      const mockSkill: Partial<ISkill> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'nonexistent',
      };

      (Skill.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([mockSkill]),
      });

      (Occupation.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([]),
      });

      const results = await OccupationService.searchOccupationBySkill(
        'nonexistent'
      );
      expect(results).toEqual([]);
      expect(Skill.find).toHaveBeenCalledWith({ title: /nonexistent/i });
      expect(Occupation.find).toHaveBeenCalledWith({
        $or: [
          { essentialSkills: { $in: [mockSkill._id] } },
          { optionalSkills: { $in: [mockSkill._id] } },
        ],
      });
    });

    it('should handle regex special characters in search query', async () => {
      const mockSkill1: Partial<ISkill> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'C++',
      };

      const mockSkill2: Partial<ISkill> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'C++ Developer',
      };

      const mockOccupation: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'C++ Developer',
        preferredLabel: 'C++ Developer',
        alternativeLabel: ['C++ Coder'],
      };

      (Skill.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([mockSkill1, mockSkill2]),
      });

      (Occupation.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([mockOccupation]),
      });

      const results = await OccupationService.searchOccupationBySkill('C++');
      expect(results).toEqual([mockOccupation]);
      expect(Skill.find).toHaveBeenCalledWith({ title: /C\+\+/i });
      expect(Occupation.find).toHaveBeenCalledWith({
        $or: [
          { essentialSkills: { $in: [mockSkill1._id, mockSkill2._id] } },
          { optionalSkills: { $in: [mockSkill1._id, mockSkill2._id] } },
        ],
      });
    });

    it('should throw an error if Occupation.find fails', async () => {
      const mockSkill: Partial<ISkill> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'developer',
      };

      (Skill.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([mockSkill]),
      });

      (Occupation.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(
        OccupationService.searchOccupationBySkill('developer')
      ).rejects.toThrow('Database error');
    });
  });

  describe('findMissingSkills', () => {
    it('should return missing essential and optional skills', async () => {
      const currentOccupationMock: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Software Engineer',
        essentialSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'JavaScript' } as ISkill,
          { _id: new mongoose.Types.ObjectId(), title: 'React' } as ISkill,
        ],
        optionalSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'Node.js' } as ISkill,
        ],
      };

      const desiredOccupationMock: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Full Stack Developer',
        essentialSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'JavaScript' } as ISkill,
          { _id: new mongoose.Types.ObjectId(), title: 'TypeScript' } as ISkill,
        ],
        optionalSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'GraphQL' } as ISkill,
        ],
      };

      (Occupation.findOne as jest.Mock)
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(currentOccupationMock),
        })
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(desiredOccupationMock),
        });

      const { missingEssentialSkills, missingOptionalSkills } =
        await OccupationService.findMissingSkills(
          'Software Engineer',
          'Full Stack Developer'
        );

      expect(missingEssentialSkills).toEqual([
        { _id: expect.anything(), title: 'TypeScript' },
      ]);
      expect(missingOptionalSkills).toEqual([
        { _id: expect.anything(), title: 'GraphQL' },
      ]);
    });

    it('should throw an error if current occupation is not found', async () => {
      (Occupation.findOne as jest.Mock)
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(null),
        })
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue({}),
        });

      await expect(
        OccupationService.findMissingSkills(
          'Nonexistent Title',
          'Full Stack Developer'
        )
      ).rejects.toThrow('Occupation not found');
    });

    it('should throw an error if desired occupation is not found', async () => {
      (Occupation.findOne as jest.Mock)
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue({}),
        })
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(null),
        });

      await expect(
        OccupationService.findMissingSkills(
          'Software Engineer',
          'Nonexistent Title'
        )
      ).rejects.toThrow('Occupation not found');
    });

    it('should handle when both occupations are found but no missing skills', async () => {
      const currentOccupationMock: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Software Engineer',
        essentialSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'JavaScript' } as ISkill,
        ],
        optionalSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'Node.js' } as ISkill,
        ],
      };

      const desiredOccupationMock: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Full Stack Developer',
        essentialSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'JavaScript' } as ISkill,
        ],
        optionalSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'Node.js' } as ISkill,
        ],
      };

      (Occupation.findOne as jest.Mock)
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(currentOccupationMock),
        })
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(desiredOccupationMock),
        });

      const { missingEssentialSkills, missingOptionalSkills } =
        await OccupationService.findMissingSkills(
          'Software Engineer',
          'Full Stack Developer'
        );

      expect(missingEssentialSkills).toEqual([]);
      expect(missingOptionalSkills).toEqual([]);
    });

    it('should handle when current occupation has no essential or optional skills', async () => {
      const currentOccupationMock: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Software Engineer',
        essentialSkills: [],
        optionalSkills: [],
      };

      const desiredOccupationMock: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Full Stack Developer',
        essentialSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'JavaScript' } as ISkill,
        ],
        optionalSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'Node.js' } as ISkill,
        ],
      };

      (Occupation.findOne as jest.Mock)
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(currentOccupationMock),
        })
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(desiredOccupationMock),
        });

      const { missingEssentialSkills, missingOptionalSkills } =
        await OccupationService.findMissingSkills(
          'Software Engineer',
          'Full Stack Developer'
        );

      expect(missingEssentialSkills).toEqual([
        { _id: expect.anything(), title: 'JavaScript' },
      ]);
      expect(missingOptionalSkills).toEqual([
        { _id: expect.anything(), title: 'Node.js' },
      ]);
    });

    it('should handle when desired occupation has no essential or optional skills', async () => {
      const currentOccupationMock: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Software Engineer',
        essentialSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'JavaScript' } as ISkill,
        ],
        optionalSkills: [
          { _id: new mongoose.Types.ObjectId(), title: 'Node.js' } as ISkill,
        ],
      };

      const desiredOccupationMock: Partial<IOccupation> = {
        _id: new mongoose.Types.ObjectId(),
        title: 'Full Stack Developer',
        essentialSkills: [],
        optionalSkills: [],
      };

      (Occupation.findOne as jest.Mock)
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(currentOccupationMock),
        })
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(desiredOccupationMock),
        });

      const { missingEssentialSkills, missingOptionalSkills } =
        await OccupationService.findMissingSkills(
          'Software Engineer',
          'Full Stack Developer'
        );

      expect(missingEssentialSkills).toEqual([]);
      expect(missingOptionalSkills).toEqual([]);
    });
  });
});
