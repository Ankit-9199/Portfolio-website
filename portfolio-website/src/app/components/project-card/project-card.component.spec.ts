import { TestBed } from '@angular/core/testing';
import * as fc from 'fast-check';
import { ProjectCardComponent } from './project-card.component';
import { Project } from '../../models/project.model';

// Feature: portfolio-website, Property 5: Project card renders required fields and conditionally shows demo link
describe('ProjectCardComponent', () => {
  interface RenderedCard {
    html: string;
    text: string;
  }

  async function renderProject(project: Project): Promise<RenderedCard> {
    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProjectCardComponent);
    fixture.componentRef.setInput('project', project);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const result = { html: el.innerHTML, text: el.textContent ?? '' };
    TestBed.resetTestingModule();
    return result;
  }

  /**
   * Property 5: Project card renders required fields and conditionally shows demo link
   * Validates: Requirements 4.2, 4.3
   *
   * For any Project object, the rendered ProjectCardComponent SHALL display the project
   * name, description, tech stack, and repository link — and SHALL include a live demo
   * link if and only if demoUrl is present on the project.
   */
  describe('Property 5: Project card renders required fields and conditionally shows demo link', () => {
    const projectWithoutDemoArb = fc.record<Project>({
      id: fc.string(),
      name: fc.string({ minLength: 1 }),
      description: fc.string({ minLength: 1 }),
      techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
      repoUrl: fc.constant('https://github.com/test'),
      featured: fc.boolean(),
    });

    const projectWithDemoArb = fc.record<Project>({
      id: fc.string(),
      name: fc.string({ minLength: 1 }),
      description: fc.string({ minLength: 1 }),
      techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
      repoUrl: fc.constant('https://github.com/test'),
      demoUrl: fc.constant('https://demo.example.com'),
      featured: fc.boolean(),
    });

    it('renders name, description, tech stack, and repo link for projects without demoUrl', async () => {
      await fc.assert(
        fc.asyncProperty(projectWithoutDemoArb, async (project) => {
          const { html, text } = await renderProject(project);

          // name appears in rendered text
          expect(text).toContain(project.name);

          // description appears in rendered text
          expect(text).toContain(project.description);

          // each tech stack item appears in rendered text
          for (const tech of project.techStack) {
            expect(text).toContain(tech);
          }

          // repo link exists in HTML (URLs are not HTML-encoded)
          expect(html).toContain(project.repoUrl);

          // demo link must NOT be present when demoUrl is absent
          expect(html).not.toContain('https://demo.example.com');
        }),
        { numRuns: 100 }
      );
    });

    it('renders name, description, tech stack, repo link, and demo link for projects with demoUrl', async () => {
      await fc.assert(
        fc.asyncProperty(projectWithDemoArb, async (project) => {
          const { html, text } = await renderProject(project);

          // name appears in rendered text
          expect(text).toContain(project.name);

          // description appears in rendered text
          expect(text).toContain(project.description);

          // each tech stack item appears in rendered text
          for (const tech of project.techStack) {
            expect(text).toContain(tech);
          }

          // repo link exists in HTML
          expect(html).toContain(project.repoUrl);

          // demo link MUST be present when demoUrl is provided
          expect(html).toContain(project.demoUrl!);
        }),
        { numRuns: 100 }
      );
    });
  });
});
