import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@layout/components/navigation/navigation.component';
import { FooterComponent } from '@layout/components/footer/footer.component';
import { TopScrollerComponent } from '@shared/components/top-scroller/top-scroller.component';
import { ScrollSectionDirective } from '@shared/directives/scroll-section.directive';
import { ScrollManagerDirective } from '@shared/directives/scroll-manager.directive';
import { NgClass, NgIf } from '@angular/common';

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
  showScrollToTop = false;

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
    this.scrollToTop();
  }

  /**
   * Updates the visibility of the "scroll to top" button based on the window's scroll position.
   */
  private updateScrollToTopVisibility() {
    const windowScrollPosition = window.scrollY;
    let distanceToBottom = this.calculateDistanceToBottom();

    // Ensure distanceToBottom is non-negative
    if (distanceToBottom < 0) distanceToBottom = 0;

    this.showScrollToTop = windowScrollPosition > 200 && distanceToBottom > 400;
  }

  /**
   * Calculates the distance from the bottom of the document to the bottom of the visible window.
   */
  private calculateDistanceToBottom(): number {
    return document.body.scrollHeight - (window.innerHeight + window.scrollY);
  }

  /**
   * Smoothly scrolls the window to the top.
   */
  private scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
