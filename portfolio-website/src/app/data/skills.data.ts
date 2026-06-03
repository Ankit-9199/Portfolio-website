import { Skill, SkillGroup } from '../models/skill.model';

export function groupSkills(skills: Skill[]): SkillGroup[] {
  const map = new Map<string, Skill[]>();
  for (const skill of skills) {
    const group = map.get(skill.category) ?? [];
    group.push(skill);
    map.set(skill.category, group);
  }
  return Array.from(map.entries()).map(([category, s]) => ({ category, skills: s }));
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Frontend',
    skills: [
      { name: 'Angular', category: 'Frontend' },
      { name: 'React.js', category: 'Frontend' },
      { name: 'Next.js', category: 'Frontend' },
      { name: 'HTML', category: 'Frontend' },
      { name: 'CSS', category: 'Frontend' },
      { name: 'JavaScript', category: 'Frontend' },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Python (Flask)', category: 'Backend' },
      { name: 'Node.js', category: 'Backend' },
      { name: 'Django (basic)', category: 'Backend' },
      { name: 'PHP (basic)', category: 'Backend' },
    ],
  },
  {
    category: 'Database',
    skills: [
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'MongoDB', category: 'Database' },
      { name: 'SQL Server', category: 'Database' },
    ],
  },
  {
    category: 'DevOps & Tools',
    skills: [
      { name: 'Docker', category: 'DevOps & Tools' },
      { name: 'Git', category: 'DevOps & Tools' },
      { name: 'GitHub', category: 'DevOps & Tools' },
      { name: 'Bitbucket', category: 'DevOps & Tools' },
      { name: 'Jira', category: 'DevOps & Tools' },
      { name: 'Selenium', category: 'DevOps & Tools' },
      { name: 'PuTTY', category: 'DevOps & Tools' },
    ],
  },
  {
    category: 'Core Skills',
    skills: [
      { name: 'REST API Development', category: 'Core Skills' },
      { name: 'API Integration', category: 'Core Skills' },
      { name: 'Authentication & Authorization', category: 'Core Skills' },
      { name: 'UI/UX Implementation', category: 'Core Skills' },
    ],
  },
];
