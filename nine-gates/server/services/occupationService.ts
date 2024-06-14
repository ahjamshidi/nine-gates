import Occupation, { IOccupation } from '../models/occupation';
import Skill, { ISkill } from '../models/skill';
class OccupationService {
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
