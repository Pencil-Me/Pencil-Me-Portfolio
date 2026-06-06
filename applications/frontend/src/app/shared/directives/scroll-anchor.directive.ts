import { Directive, HostListener, inject, Input } from '@angular/core';

import { ScrollManagerDirective } from './scroll-manager.directive';

// Directive for handling scroll anchor behavior
@Directive({
  selector: '[appScrollAnchor]',
  standalone: true, // Indicating that the directive is standalone
})
export class ScrollAnchorDirective {
  private manager = inject(ScrollManagerDirective);

  @Input('appScrollAnchor') id: string | number = ''; // Constructor with ScrollManagerDirective injection

  // Host listener for the 'click' event
  @HostListener('click')
  // Method to scroll to the associated section when the anchor is clicked
  scroll(): void {
    this.manager.scroll(this.id);
  }
}
