import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ScrollManagerDirective } from './scroll-manager.directive';

// Directive for scrolling to a specific section
@Directive({
  selector: '[appScrollSection]',
  standalone: true, // Indicating that the directive is standalone
})
export class ScrollSectionDirective implements OnInit, OnDestroy {
  @Input('appScrollSection') id: string | number = ''; // Input property to specify the section ID

  constructor(
    private host: ElementRef<HTMLElement>, // Reference to the host element
    private manager: ScrollManagerDirective, // Reference to the scroll manager directive
  ) {}

  // Lifecycle hook called after Angular initializes the directive
  ngOnInit() {
    this.manager.register(this); // Registering the directive with the scroll manager
  }

  // Lifecycle hook called before Angular destroys the directive
  ngOnDestroy() {
    this.manager.remove(this); // Removing the directive from the scroll manager
  }

  // Method to scroll to the section
  scroll() {
    this.host.nativeElement.scrollIntoView({
      // Using native JavaScript scrollIntoView method
      behavior: 'smooth', // Scroll behavior: smooth
    });
  }
}
