import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import type { IProjectDate } from '@modules/projects/projects.models';

@Component({
  selector: 'app-project-date-range',
  templateUrl: './project-date-range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDateRangeComponent {
  @Input({ required: true }) dates: IProjectDate[] = [];
  @Input() ariaLabel = 'Projektzeitraum';
}
