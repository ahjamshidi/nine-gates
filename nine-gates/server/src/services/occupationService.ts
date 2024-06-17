import { findIntersections, findNotIntersections } from '../libs/utils';
import Occupation, { IOccupation } from '../models/occupation';
import Skill, { ISkill } from '../models/skill';

class OccupationService {
  escapeStringRegexp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters for regex
  }
  async getOcuppationByTitleWithSkills(occupationId: string): Promise<
  IOccupation & {
    essentialSkills: ISkill[];
    optionalSkills: ISkill[];
  }
> {
  const occupation = (await Occupation.findOne({title:occupationId.trim()})
    .populate<{ essentialSkills: ISkill[]; optionalSkills: ISkill[] }>(
      'essentialSkills optionalSkills'
    )
    .exec()) as IOccupation & {
    essentialSkills: ISkill[];
    optionalSkills: ISkill[];
  };
  return occupation;
}
  async getOcuppationByIdWithSkills(occupationId: string): Promise<
    IOccupation & {
      essentialSkills: ISkill[];
      optionalSkills: ISkill[];
    }
  > {
    const occupation = (await Occupation.findById(occupationId.trim())
      .populate<{ essentialSkills: ISkill[]; optionalSkills: ISkill[] }>(
        'essentialSkills optionalSkills'
      )
      .exec()) as IOccupation & {
      essentialSkills: ISkill[];
      optionalSkills: ISkill[];
    };
    return occupation;
  }
  async compaireCurrentAndDesireJobs(
    currentOccupationTitle: string,
    desiredOccupationTitle: string
  ) {
    const currentOccupation = await this.getOcuppationByTitleWithSkills(
      currentOccupationTitle
    );
    const desiredOccupation = await this.getOcuppationByTitleWithSkills(
      desiredOccupationTitle
    );

    const commonEssentialSkills = findIntersections(
      currentOccupation.essentialSkills,
      desiredOccupation.essentialSkills
    );
    const missingEssentialSkills = findNotIntersections(
      currentOccupation.essentialSkills,
      desiredOccupation.essentialSkills
    );
    const commonOptionalSkills = findIntersections(
      currentOccupation.optionalSkills,
      desiredOccupation.optionalSkills
    );
    const missingOptionalSkills = findNotIntersections(
      currentOccupation.optionalSkills,
      desiredOccupation.optionalSkills
    );
    return {
      currentOccupation,
      desiredOccupation,
      commonEssentialSkills,
      missingEssentialSkills,
      commonOptionalSkills,
      missingOptionalSkills,
    };
  }
  async searchOccupationByTitle(searchQuery: string): Promise<IOccupation[]> {
    const escapedQuery = this.escapeStringRegexp(searchQuery);
    const regex = new RegExp(escapedQuery, 'i');

    const results = await Occupation.find({
      $or: [
        { title: regex },
        { preferredLabel: regex },
        { alternativeLabel: { $elemMatch: { $regex: regex } } },
      ],
    }).select('_id title');

    return results;
  }

  async searchOccupationBySkill(searchQuery: string): Promise<IOccupation[]> {
    const escapedQuery = this.escapeStringRegexp(searchQuery);
    const regex = new RegExp(escapedQuery, 'i');

    const skills = await Skill.find({ title: regex }).select('_id');

    const skillIds = skills.map((skill) => skill._id);

    const results = await Occupation.find({
      $or: [
        { essentialSkills: { $in: skillIds } },
        { optionalSkills: { $in: skillIds } },
      ],
    }).select('_id title');

    return results;
  }
  async findMissingSkills(
    currentOccupationTitle: string,
    desiredOccupationTitle: string
  ) {
    const currentOccupation = (await Occupation.findOne({
      title: currentOccupationTitle.trim(),
    })
      .populate<{ essentialSkills: ISkill[]; optionalSkills: ISkill[] }>(
        'essentialSkills optionalSkills'
      )
      .exec()) as IOccupation & {
      essentialSkills: ISkill[];
      optionalSkills: ISkill[];
    };

    const desiredOccupation = (await Occupation.findOne({
      title: desiredOccupationTitle.trim(),
    })
      .populate<{ essentialSkills: ISkill[]; optionalSkills: ISkill[] }>(
        'essentialSkills optionalSkills'
      )
      .exec()) as IOccupation & {
      essentialSkills: ISkill[];
      optionalSkills: ISkill[];
    };

    if (!currentOccupation || !desiredOccupation) {
      throw new Error('Occupation not found');
    }

    const currentEssentialSkills = new Set(
      currentOccupation.essentialSkills.map((skill: ISkill) => skill.title)
    );
    const currentOptionalSkills = new Set(
      currentOccupation.optionalSkills.map((skill: ISkill) => skill.title)
    );

    const missingEssentialSkills = desiredOccupation.essentialSkills.filter(
      (skill: ISkill) => !currentEssentialSkills.has(skill.title)
    );
    const missingOptionalSkills = desiredOccupation.optionalSkills.filter(
      (skill: ISkill) => !currentOptionalSkills.has(skill.title)
    );

    return {
      missingEssentialSkills,
      missingOptionalSkills,
    };
  }
}

export default new OccupationService();
