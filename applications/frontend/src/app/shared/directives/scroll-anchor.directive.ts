import { Directive, HostListener, Input } from '@angular/core';
import { ScrollManagerDirective } from './scroll-manager.directive';

// Directive for handling scroll anchor behavior
@Directive({
  selector: '[appScrollAnchor]',
  standalone: true, // Indicating that the directive is standalone
})
export class ScrollAnchorDirective {
  @Input('appScrollAnchor') id: string | number = ''; // Input property for specifying the anchor ID

  constructor(private manager: ScrollManagerDirective) {} // Constructor with ScrollManagerDirective injection

  // Host listener for the 'click' event
  @HostListener('click')
  // Method to scroll to the associated section when the anchor is clicked
  scroll() {
    this.manager.scroll(this.id); // Invoking the scroll method of the scroll manager with the specified ID
  }
}
