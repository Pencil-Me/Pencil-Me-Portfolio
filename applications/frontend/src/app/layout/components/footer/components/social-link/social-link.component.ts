import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface SocialLink {
  name: string;
  url: string;
  svgPath: string;
  viewBox: string;
}

@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './social-link.component.css',
  templateUrl: './social-link.component.html',
})
export class SocialLinkComponent {
  @Input() socialLinks: SocialLink[] = [];
}
