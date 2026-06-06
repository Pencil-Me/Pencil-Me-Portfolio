import { Directive, ElementRef, Input, inject } from '@angular/core';
import type { OnDestroy, OnInit } from '@angular/core';
import { ScrollManagerDirective } from './scroll-manager.directive';

// Directive for scrolling to a specific section
@Directive({
  selector: '[appScrollSection]',
  standalone: true, // Indicating that the directive is standalone
})
export class ScrollSectionDirective implements OnInit, OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private manager = inject(ScrollManagerDirective);

  @Input('appScrollSection') id: string | number = '';

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
