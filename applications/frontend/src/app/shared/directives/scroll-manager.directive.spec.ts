import { Component } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ScrollSectionDirective } from '@shared/directives/scroll-section.directive';

import { ScrollManagerDirective } from './scroll-manager.directive';

@Component({
  template: `
    <div appScrollManager>
      <div appScrollSection="testSection"></div>
    </div>
  `,
  imports: [ScrollManagerDirective, ScrollSectionDirective],
})
class TestHostComponent {}

describe('ScrollManagerDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: ScrollManagerDirective;
  let section: ScrollSectionDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    directive = fixture.debugElement
      .query(By.directive(ScrollManagerDirective))
      .injector.get(ScrollManagerDirective);
    section = fixture.debugElement
      .query(By.directive(ScrollSectionDirective))
      .injector.get(ScrollSectionDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should register a section', () => {
    expect(directive['sections'].size).toBe(1);
    expect(directive['sections'].get('testSection')).toBe(section);
  });

  it('should remove a section', () => {
    directive.remove(section);
    expect(directive['sections'].size).toBe(0);
  });

  it('should scroll to a section', () => {
    const scrollSpy = spyOn(section, 'scroll');
    directive.scroll('testSection');
    expect(scrollSpy).toHaveBeenCalled();
  });
});
