import {
  Directive,
  ElementRef,
  inject,
  Input,
  NgZone,
  type AfterViewInit,
  type OnDestroy,
  type OnInit,
} from '@angular/core';

export type ScrollRevealVariant = 'up' | 'left' | 'right' | 'scale' | 'band';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, AfterViewInit, OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private ngZone = inject(NgZone);

  @Input('appScrollReveal') variant: ScrollRevealVariant = 'up';
  @Input() revealDelay = 0;
  @Input() revealThreshold = 0.08;

  private observer?: IntersectionObserver;
  private revealed = false;

  ngOnInit(): void {
    const element = this.host.nativeElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    element.classList.add('pm-scroll-reveal', `pm-scroll-reveal--${this.variant}`);
    if (this.revealDelay > 0) {
      element.style.setProperty('--pm-reveal-delay', `${this.revealDelay}ms`);
    }

    if (reducedMotion) {
      this.markRevealed(element);
      return;
    }

    const threshold = this.variant === 'band' ? 0 : this.revealThreshold;

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.ngZone.run(() => this.markRevealed(entry.target as HTMLElement));
            }
          });
        },
        {
          threshold,
          rootMargin: '0px 0px -4% 0px',
        },
      );
      this.observer.observe(element);
    });
  }

  ngAfterViewInit(): void {
    if (this.revealed) return;
    this.checkInitialVisibility();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private checkInitialVisibility(): void {
    requestAnimationFrame(() => {
      const element = this.host.nativeElement;
      if (this.revealed || !this.isInViewport(element)) return;
      this.ngZone.run(() => this.markRevealed(element));
    });
  }

  private isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08;
  }

  private markRevealed(element: HTMLElement): void {
    if (this.revealed) return;
    this.revealed = true;
    element.classList.add('is-revealed');
    this.observer?.unobserve(element);
  }
}
