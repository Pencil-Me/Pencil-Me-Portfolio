import { ScrollManagerDirective } from './scroll-manager.directive';
import { ScrollSectionDirective } from '@shared/directives/scroll-section.directive';
import { ElementRef } from '@angular/core';

describe('ScrollManagerDirective', () => {
  let directive: ScrollManagerDirective;
  let section: ScrollSectionDirective;
  let mockElementRef: ElementRef<HTMLElement>;

  beforeEach(() => {
    directive = new ScrollManagerDirective();
    mockElementRef = { nativeElement: {} } as unknown as ElementRef<HTMLElement>;
    section = new ScrollSectionDirective(mockElementRef, directive);
    section.id = 'testSection';
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should register a section', () => {
    directive.register(section);
    expect(directive['sections'].size).toBe(1);
    expect(directive['sections'].get('testSection')).toBe(section);
  });

  it('should remove a section', () => {
    directive.register(section);
    directive.remove(section);
    expect(directive['sections'].size).toBe(0);
  });

  it('should scroll to a section', () => {
    const scrollSpy = spyOn(section, 'scroll');
    directive.register(section);
    directive.scroll('testSection');
    expect(scrollSpy).toHaveBeenCalled();
  });
});
