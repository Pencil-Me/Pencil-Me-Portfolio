import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-footer-navigation',
  imports: [CommonModule, RouterLink],
  styleUrl: './footer-navigation.component.scss',
  templateUrl: './footer-navigation.component.html',
})
export class FooterNavigationComponent {
  @Input() navLinks: NavLink[] = [];
}
