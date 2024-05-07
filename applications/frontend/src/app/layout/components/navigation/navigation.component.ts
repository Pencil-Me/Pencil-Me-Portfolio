import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgForOf } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, NgForOf, NgClass],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  sticky = false;
  navItems = [
    {
      label: 'Start',
      target: 'home',
    },
    {
      label: 'Über mich',
      target: 'about',
    },
    {
      label: 'Projekte',
      target: 'projects',
    },
    {
      label: 'Kontakt',
      target: 'contact',
    },
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowScrollPosition = window.scrollY;
    this.sticky = windowScrollPosition > 200;
  }
}
