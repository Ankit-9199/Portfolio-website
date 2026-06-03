import { Component, Input } from '@angular/core';
import { SkillGroup } from '../../models/skill.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  @Input() groups: SkillGroup[] = [];
}
