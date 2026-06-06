import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

import { ThemeService } from '@app/core/services/theme/theme.service';
import { PmLogoComponent } from '@layout/components/navigation/components/pm-logo/pm-logo.component';
import { RoutePrefetchService } from '@core/routing/route-prefetch.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, NgClass, FaIconComponent, NgbCollapse, RouterLinkActive, PmLogoComponent],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private routePrefetch = inject(RoutePrefetchService);
  readonly themeService = inject(ThemeService);

  faBars = faBars;
  faSun = faSun;
  faMoon = faMoon;
  readonly sticky = signal(false);
  readonly isCollapsed = signal(true);
  navItems = [
    { label: 'Start', target: 'home' },
    { label: 'Über mich', target: 'about' },
    { label: 'Projekte', target: 'projects' },
    { label: 'Kontakt', target: 'contact' },
  ];

  constructor() {
    this.themeService.init();
    this.router.events
      .pipe(
        filter((event): event is NavigationStart => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.collapseNavigation());
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleCollapsed(): void {
    this.isCollapsed.update((value) => !value);
  }

  formatNavIndex(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  prefetchRoute(target: string): void {
    this.routePrefetch.prefetch(target);
  }

  private collapseNavigation(): void {
    this.isCollapsed.set(true);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.sticky.set(window.scrollY > 200);
  }
}
