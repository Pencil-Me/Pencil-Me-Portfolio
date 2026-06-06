import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface TechStack {
  name: string;
  version: string;
  url?: string;
}

@Component({
  selector: 'app-footer-disclaimer',
  imports: [],
  styleUrl: './footer-disclaimer.component.scss',
  templateUrl: './footer-disclaimer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterDisclaimerComponent {
  @Input() techStack: TechStack[] = [];
}
