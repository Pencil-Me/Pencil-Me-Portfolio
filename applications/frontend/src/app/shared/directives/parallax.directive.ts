import { Directive, ElementRef, Input, NgZone, inject } from '@angular/core';
import type { OnDestroy, OnInit } from '@angular/core';

export type ParallaxMode = 'viewport' | 'scroll';

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private ngZone = inject(NgZone);

  /** Stärke des Offsets — typisch 0.08–0.45 */
  @Input('appParallax') intensity = 0.2;
  @Input() parallaxMax = 140;
  @Input() parallaxMode: ParallaxMode = 'viewport';

  private rafId = 0;
  private disabled = false;
  private readonly onScroll = (): void => {
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => this.updateTransform());
  };

  ngOnInit(): void {
    this.disabled = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.disabled) return;

    this.host.nativeElement.classList.add('pm-parallax-layer');
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
      this.updateTransform();
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    this.host.nativeElement.style.removeProperty('transform');
  }

  private updateTransform(): void {
    const element = this.host.nativeElement;
    const offset =
      this.parallaxMode === 'scroll' ? this.getScrollOffset() : this.getViewportOffset(element);

    const clamped = Math.max(-this.parallaxMax, Math.min(this.parallaxMax, offset));
    element.style.transform = `translate3d(0, ${clamped}px, 0)`;
  }

  private getViewportOffset(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.5;
    const elementCenter = rect.top + rect.height * 0.5;
    const progress = (viewportCenter - elementCenter) / window.innerHeight;
    return progress * this.intensity * 100;
  }

  private getScrollOffset(): number {
    return window.scrollY * this.intensity;
  }
}
