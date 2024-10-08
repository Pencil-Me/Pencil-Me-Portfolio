import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-footer-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrl: './footer-navigation.component.css',
  templateUrl: './footer-navigation.component.html',
})
export class FooterNavigationComponent {
  @Input() navLinks: NavLink[] = [];
}
