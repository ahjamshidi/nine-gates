import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OccupationService from '../../src/services/occupationService';
import Occupation, { IOccupation } from '../../src/models/occupation';

dotenv.config();

jest.mock('../../src/models/occupation');

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
});
