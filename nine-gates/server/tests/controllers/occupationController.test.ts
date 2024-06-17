import request from 'supertest';
import app from '../../src/index';
import OccupationService from '../../src/services/occupationService';

jest.mock('../../src/services/occupationService');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Occupation Controller', () => {
  describe('searchOccupation', () => {
    it('should return 400 if searchQuery is not provided', async () => {
      const response = await request(app).get('/api/occupations/search');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Search query is required');
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 200 and search results for a valid query', async () => {
      const mockResults = [
        {
          _id: '1',
          title: 'Developer',
          preferredLabel: 'Developer',
          alternativeLabel: ['Dev'],
        },
        {
          _id: '2',
          title: 'Software Engineer',
          preferredLabel: 'Engineer',
          alternativeLabel: ['Eng'],
        },
      ];
      (
        OccupationService.searchOccupationByTitle as jest.Mock
      ).mockResolvedValue(mockResults);

      const response = await request(app)
        .get('/api/occupations/search')
        .query({ searchQuery: 'developer' });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResults);
      expect(response.body.message).toBe('Search successful');
    });

    it('should return 200 and an empty array if no results found', async () => {
      (
        OccupationService.searchOccupationByTitle as jest.Mock
      ).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/occupations/search')
        .query({ searchQuery: 'nonexistentoccupation' });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.message).toBe('Search successful');
    });

    it('should handle errors gracefully', async () => {
      (
        OccupationService.searchOccupationByTitle as jest.Mock
      ).mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await request(app)
        .get('/api/occupations/search')
        .query({ searchQuery: 'developer' });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error searching occupations');
      expect(response.body.error).toBe('Test error');
    });
  });

  describe('searchOccupationByTitle', () => {
    it('should return 400 if searchQuery is not provided', async () => {
      const response = await request(app).get('/api/occupations/search/title');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Search query is required');
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 200 and search results for a valid query', async () => {
      const mockResults = [
        {
          _id: '1',
          title: 'Developer',
          preferredLabel: 'Developer',
          alternativeLabel: ['Dev'],
        },
        {
          _id: '2',
          title: 'Software Engineer',
          preferredLabel: 'Engineer',
          alternativeLabel: ['Eng'],
        },
      ];
      (
        OccupationService.searchOccupationByTitle as jest.Mock
      ).mockResolvedValue(mockResults);

      const response = await request(app)
        .get('/api/occupations/search/title')
        .query({ searchQuery: 'developer' });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResults);
      expect(response.body.message).toBe('Search successful');
    });

    it('should return 200 and an empty array if no results found', async () => {
      (
        OccupationService.searchOccupationByTitle as jest.Mock
      ).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/occupations/search/title')
        .query({ searchQuery: 'nonexistentoccupation' });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.message).toBe('Search successful');
    });

    it('should handle errors gracefully', async () => {
      (
        OccupationService.searchOccupationByTitle as jest.Mock
      ).mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await request(app)
        .get('/api/occupations/search/title')
        .query({ searchQuery: 'developer' });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        'Error searching occupations by title'
      );
      expect(response.body.error).toBe('Test error');
    });
  });

  describe('searchOccupationBySkill', () => {
    it('should return 400 if searchQuery is not provided', async () => {
      const response = await request(app).get('/api/occupations/search/skill');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Search query is required');
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 200 and search results for a valid query', async () => {
      const mockResults = [
        {
          _id: '1',
          title: 'Developer',
          preferredLabel: 'Developer',
          alternativeLabel: ['Dev'],
        },
        {
          _id: '2',
          title: 'Software Engineer',
          preferredLabel: 'Engineer',
          alternativeLabel: ['Eng'],
        },
      ];
      (
        OccupationService.searchOccupationBySkill as jest.Mock
      ).mockResolvedValue(mockResults);

      const response = await request(app)
        .get('/api/occupations/search/skill')
        .query({ searchQuery: 'developer' });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResults);
      expect(response.body.message).toBe('Search successful');
    });

    it('should return 200 and an empty array if no results found', async () => {
      (
        OccupationService.searchOccupationBySkill as jest.Mock
      ).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/occupations/search/skill')
        .query({ searchQuery: 'nonexistentoccupation' });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.message).toBe('Search successful');
    });

    it('should handle errors gracefully', async () => {
      (
        OccupationService.searchOccupationBySkill as jest.Mock
      ).mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await request(app)
        .get('/api/occupations/search/skill')
        .query({ searchQuery: 'developer' });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        'Error searching occupations by skill'
      );
      expect(response.body.error).toBe('Test error');
    });
  });

  describe('getMissingSkills', () => {
    it('should return 400 if currentOccupationTitle is not provided', async () => {
      const response = await request(app).get(
        '/api/occupations/missing-skills'
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'Current and desired occupation titles are required'
      );
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 400 if desiredOccupationTitle is not provided', async () => {
      const response = await request(app)
        .get('/api/occupations/missing-skills')
        .query({ currentOccupationTitle: 'developer' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'Current and desired occupation titles are required'
      );
      expect(response.body.error).toBe('Invalid input');
    });

    it('should return 200 and missing skills for valid occupations', async () => {
      const mockMissingSkills = {
        missingEssentialSkills: ['Skill 1', 'Skill 2'],
        missingOptionalSkills: ['Skill 3'],
      };
      (OccupationService.findMissingSkills as jest.Mock).mockResolvedValue(
        mockMissingSkills
      );

      const response = await request(app)
        .get('/api/occupations/missing-skills')
        .query({
          currentOccupationTitle: 'developer',
          desiredOccupationTitle: 'engineer',
        });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockMissingSkills);
      expect(response.body.message).toBe('Skills comparison successful');
    });

    it('should return 200 and empty arrays if no missing skills found', async () => {
      const mockMissingSkills = {
        missingEssentialSkills: [],
        missingOptionalSkills: [],
      };
      (OccupationService.findMissingSkills as jest.Mock).mockResolvedValue(
        mockMissingSkills
      );

      const response = await request(app)
        .get('/api/occupations/missing-skills')
        .query({
          currentOccupationTitle: 'developer',
          desiredOccupationTitle: 'developer',
        });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockMissingSkills);
      expect(response.body.message).toBe('Skills comparison successful');
    });

    it('should handle errors gracefully', async () => {
      (OccupationService.findMissingSkills as jest.Mock).mockImplementation(
        () => {
          throw new Error('Test error');
        }
      );

      const response = await request(app)
        .get('/api/occupations/missing-skills')
        .query({
          currentOccupationTitle: 'developer',
          desiredOccupationTitle: 'engineer',
        });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error comparing occupations');
      expect(response.body.error).toBe('Test error');
    });
  });
});
