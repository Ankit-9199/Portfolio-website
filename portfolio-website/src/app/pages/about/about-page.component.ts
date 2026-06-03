import { Component } from '@angular/core';
import { SkillsComponent } from '../../components/skills/skills.component';
import { SKILL_GROUPS } from '../../data/skills.data';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [SkillsComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPageComponent {
  skillGroups = SKILL_GROUPS;
}
