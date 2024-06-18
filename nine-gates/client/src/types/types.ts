export interface Skill {
  title: string;
  description: string;
  skillType?: string;
  uri?: string;
}
export interface Occupation {
  alternativeLabel: string[];
  preferredLabel: string;
  title: string;
  _id: string;
}

export interface SkillDetails {
  _id: string;
  title: string;
  uri: string;
  skillType: string;
  description: string;
  __v: number;
}

export interface OccupationDetails {
  _id: string;
  uri: string;
  __v: number;
  alternativeLabel: string[];
  code: string;
  description: string;
  essentialSkills: SkillDetails[];
  optionalSkills: SkillDetails[];
  preferredLabel: string;
  title: string;
}
