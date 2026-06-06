import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  /**
   * Calculates the distance from the bottom of the document to the bottom of the visible window.
   * @returns The distance to the bottom in pixels.
   */
  calculateDistanceToBottom(): number {
    return document.body.scrollHeight - (window.innerHeight + window.scrollY);
  }

  /**
   * Smoothly scrolls the window to the top.
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /**
   * Gets the current vertical scroll position of the window.
   * @returns The current scroll position in pixels.
   */
  getScrollPosition(): number {
    return window.scrollY || document.documentElement.scrollTop;
  }

  /**
   * Normalized scroll progress between 0 (top) and 1 (bottom).
   */
  getScrollProgress(): number {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return 0;
    return Math.min(1, Math.max(0, this.getScrollPosition() / max));
  }

  /**
   * Scrolls to a specific element on the page.
   * @param elementId The ID of the element to scroll to.
   */
  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
