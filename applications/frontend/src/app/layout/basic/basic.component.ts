import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@layout/components/footer/footer.component';
import { NavigationComponent } from '@layout/components/navigation/navigation.component';

import { RouteLoadingComponent } from '@core/routing/route-loading.component';
import { RouteLoadingService } from '@core/routing/route-loading.service';
import { TopScrollerComponent } from '@shared/components/top-scroller/top-scroller.component';
import { ScrollManagerDirective } from '@shared/directives/scroll-manager.directive';
import { ScrollSectionDirective } from '@shared/directives/scroll-section.directive';
import { ScrollService } from '@shared/services/scroll.service';

@Component({
  selector: 'app-basic',
  imports: [
    RouterOutlet,
    NavigationComponent,
    FooterComponent,
    TopScrollerComponent,
    ScrollSectionDirective,
    ScrollManagerDirective,
    RouteLoadingComponent,
  ],
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicComponent {
  private scrollService = inject(ScrollService);
  readonly routeLoading = inject(RouteLoadingService);

  readonly showScrollToTop = signal(false);
  readonly scrollProgress = signal(0);

  private readonly scrollThreshold = 200;
  private readonly bottomThreshold = 400;

  constructor() {
    this.updateScrollToTopVisibility();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.updateScrollToTopVisibility();
  }

  onDeactivate(): void {
    this.scrollService.scrollToTop();
  }

  private updateScrollToTopVisibility(): void {
    const windowScrollPosition = window.scrollY;
    const distanceToBottom = this.scrollService.calculateDistanceToBottom();

    this.scrollProgress.set(this.scrollService.getScrollProgress());
    this.showScrollToTop.set(
      windowScrollPosition > this.scrollThreshold && distanceToBottom > this.bottomThreshold,
    );
  }
}
