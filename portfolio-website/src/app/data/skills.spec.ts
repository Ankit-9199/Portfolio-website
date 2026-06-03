// Feature: portfolio-website, Property 6: Skills grouping preserves all skills

import * as fc from 'fast-check';
import { groupSkills } from './skills.data';
import { Skill } from '../models/skill.model';

describe('groupSkills', () => {
  /**
   * Property 6: Skills grouping preserves all skills
   * Validates: Requirements 3.2
   */
  it('Property 6: grouped output contains every original skill with no additions or omissions', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ name: fc.string(), category: fc.string() })),
        (skills: Skill[]) => {
          const groups = groupSkills(skills);
          const flattenedSkills = groups.flatMap(g => g.skills);

          // No omissions: every original skill appears in the output
          for (const skill of skills) {
            const found = flattenedSkills.some(
              s => s.name === skill.name && s.category === skill.category,
            );
            if (!found) return false;
          }

          // No additions: output count equals input count
          if (flattenedSkills.length !== skills.length) return false;

          return true;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('groups skills by category', () => {
    const skills: Skill[] = [
      { name: 'Angular', category: 'Frontend' },
      { name: 'Python', category: 'Backend' },
      { name: 'TypeScript', category: 'Frontend' },
    ];
    const groups = groupSkills(skills);
    const frontend = groups.find(g => g.category === 'Frontend');
    const backend = groups.find(g => g.category === 'Backend');
    expect(frontend?.skills.length).toBe(2);
    expect(backend?.skills.length).toBe(1);
  });

  it('returns empty array for empty input', () => {
    expect(groupSkills([])).toEqual([]);
  });
});
