import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appTrackVisibility]',
  standalone: true,
})
export class TrackVisibilityDirective implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  @Output()
  visible  = new EventEmitter<boolean>();

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.intersectionCallback(entry);
        });
      });
      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private intersectionCallback(entry: IntersectionObserverEntry): void {
    this.visible.emit(entry.isIntersecting);
  }
}
