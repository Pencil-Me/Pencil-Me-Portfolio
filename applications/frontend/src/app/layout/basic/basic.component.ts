import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { NavigationComponent } from '@layout/components/navigation/navigation.component';
import { FooterComponent } from '@layout/components/footer/footer.component';
import { TopScrollerComponent } from '@shared/components/top-scroller/top-scroller.component';
import { ScrollSectionDirective } from '@shared/directives/scroll-section.directive';
import { ScrollManagerDirective } from '@shared/directives/scroll-manager.directive';
import { ScrollService } from '@shared/services/scroll.service';

@Component({
  selector: 'app-basic',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent,
    FooterComponent,
    TopScrollerComponent,
    ScrollSectionDirective,
    ScrollManagerDirective,
    NgIf,
    NgClass,
  ],
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.scss',
})
export class BasicComponent {
  // Flag to control the visibility of the "scroll to top" button
  showScrollToTop = false;

  // Threshold values for scroll visibility
  private readonly SCROLL_THRESHOLD = 200;
  private readonly BOTTOM_THRESHOLD = 400;

  constructor(private scrollService: ScrollService) {}

  ngOnInit() {
    this.updateScrollToTopVisibility();
  }

  /**
   * HostListener to monitor the scroll event and update the visibility of the "scroll to top" button.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateScrollToTopVisibility();
  }

  /**
   * Called when a route is deactivated to smoothly scroll the window to the top.
   */
  onDeactivate() {
    this.scrollService.scrollToTop();
  }

  /**
   * Updates the visibility of the "scroll to top" button based on the window's scroll position.
   */
  private updateScrollToTopVisibility() {
    const windowScrollPosition = window.scrollY;
    const distanceToBottom = this.scrollService.calculateDistanceToBottom();

    this.showScrollToTop = windowScrollPosition > this.SCROLL_THRESHOLD && distanceToBottom > this.BOTTOM_THRESHOLD;
  }
}
