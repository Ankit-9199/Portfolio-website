export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Tools' | string;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}
