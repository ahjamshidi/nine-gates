import { ISkill } from '@/models/skill';

export const findIntersections = (firstArray: ISkill[], secendArray: ISkill[]) => {
  return firstArray.filter((e) => {
    return secendArray.some((item) => item.id === e.id);
  });
};
export const findNotIntersections = (
  firstArray: ISkill[],
  secendArray: ISkill[]
) => {
  return secendArray.filter((e) => {
    return !firstArray.some((item) => item.id === e.id);
  });
};
