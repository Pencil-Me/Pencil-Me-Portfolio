import { CommonModule } from '@angular/common';
import { Input, Component } from '@angular/core';

export interface TechStack {
  name: string;
  version: string;
  url?: string;
}

@Component({
  selector: 'app-footer-disclaimer',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './footer-disclaimer.component.scss',
  templateUrl: './footer-disclaimer.component.html',
})
export class FooterDisclaimerComponent {
  @Input() techStack: TechStack[] = [];
}
