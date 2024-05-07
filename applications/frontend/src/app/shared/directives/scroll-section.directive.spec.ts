import { ElementRef } from '@angular/core';
import { ScrollManagerDirective } from './scroll-manager.directive';
import { ScrollSectionDirective } from './scroll-section.directive';

describe('ScrollSectionDirective', () => {
  let directive: ScrollSectionDirective;
  let mockElementRef: ElementRef<HTMLElement>;
  let mockManager: ScrollManagerDirective;

  beforeEach(() => {
    mockElementRef = {
      nativeElement: {
        scrollIntoView: jasmine.createSpy('scrollIntoView'),
      },
    } as unknown as ElementRef<HTMLElement>;
    mockManager = jasmine.createSpyObj('ScrollManagerDirective', ['register', 'remove']);

    directive = new ScrollSectionDirective(mockElementRef, mockManager);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should register on init', () => {
    directive.ngOnInit();
    expect(mockManager.register).toHaveBeenCalledWith(directive);
  });

  it('should remove on destroy', () => {
    directive.ngOnDestroy();
    expect(mockManager.remove).toHaveBeenCalledWith(directive);
  });

  it('should scroll into view', () => {
    directive.scroll();
    expect(mockElementRef.nativeElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    });
  });
});
