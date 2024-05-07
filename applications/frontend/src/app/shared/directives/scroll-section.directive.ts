import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ScrollManagerDirective } from './scroll-manager.directive';

@Directive({
  selector: '[appScrollSection]',
  standalone: true,
})
export class ScrollSectionDirective implements OnInit, OnDestroy {
  @Input('appScrollSection') id: string | number = '';

  constructor(
    private host: ElementRef<HTMLElement>,
    private manager: ScrollManagerDirective,
  ) {}

  ngOnInit() {
    this.manager.register(this);
  }

  ngOnDestroy() {
    this.manager.remove(this);
  }

  scroll() {
    this.host.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
