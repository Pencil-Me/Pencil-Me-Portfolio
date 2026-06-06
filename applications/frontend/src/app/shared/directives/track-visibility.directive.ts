import { Directive, ElementRef, EventEmitter, NgZone, Output, inject } from '@angular/core';
import type { AfterViewInit, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appTrackVisibility]',
  standalone: true,
})
export class TrackVisibilityDirective implements OnInit, AfterViewInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private ngZone = inject(NgZone);

  private observer!: IntersectionObserver;
  private latchedVisible = false;

  @Output()
  visible = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.ngZone.run(() => this.emitVisible(true));
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
      );
      this.observer.observe(this.el.nativeElement);
    });
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      if (this.latchedVisible || !this.isInViewport(this.el.nativeElement)) return;
      this.ngZone.run(() => this.emitVisible(true));
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private emitVisible(value: boolean): void {
    if (value) {
      this.latchedVisible = true;
    }
    this.visible.emit(value);
  }

  private isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewportHeight * 0.9 && rect.bottom > viewportHeight * 0.1;
  }
}
