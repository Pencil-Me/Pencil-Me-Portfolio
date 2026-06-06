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
  ngOnInit(): void {
    this.manager.register(this);
  }

  ngOnDestroy(): void {
    this.manager.remove(this);
  }

  scroll(): void {
    this.host.nativeElement.scrollIntoView({
      // Using native JavaScript scrollIntoView method
      behavior: 'smooth', // Scroll behavior: smooth
    });
  }
}
