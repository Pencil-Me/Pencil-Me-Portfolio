import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, NgForOf, NgClass, NgIf, FaIconComponent, NgbCollapse, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  faBars = faBars;
  sticky = false;
  isCollapsed = true;
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

  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isCollapsed = true;
      }
    });
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowScrollPosition = window.scrollY;
    this.sticky = windowScrollPosition > 200;
  }
}
