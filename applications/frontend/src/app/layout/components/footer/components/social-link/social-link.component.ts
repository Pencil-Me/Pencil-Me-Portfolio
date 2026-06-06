import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface SocialLink {
  name: string;
  url: string;
  svgPath: string;
  viewBox: string;
}

@Component({
  selector: 'app-social-links',
  imports: [],
  styleUrl: './social-link.component.scss',
  templateUrl: './social-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialLinkComponent {
  @Input() socialLinks: SocialLink[] = [];
}
