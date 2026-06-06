import { Component } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { ScrollManagerDirective } from './scroll-manager.directive';
import { ScrollSectionDirective } from './scroll-section.directive';

@Component({
  template: `<div appScrollSection="section1"></div>`,
  imports: [ScrollSectionDirective],
})
class TestHostComponent {}

describe('ScrollSectionDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: ScrollSectionDirective;
  let mockManager: jasmine.SpyObj<ScrollManagerDirective>;

  beforeEach(async () => {
    mockManager = jasmine.createSpyObj('ScrollManagerDirective', ['register', 'remove']);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: ScrollManagerDirective, useValue: mockManager }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    directive = fixture.debugElement.children[0].injector.get(ScrollSectionDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should register on init', () => {
    expect(mockManager.register).toHaveBeenCalledWith(directive);
  });

  it('should remove on destroy', () => {
    fixture.destroy();
    expect(mockManager.remove).toHaveBeenCalledWith(directive);
  });

  it('should scroll into view', () => {
    const nativeElement = fixture.debugElement.children[0].nativeElement as HTMLElement;
    spyOn(nativeElement, 'scrollIntoView');

    directive.scroll();

    expect(nativeElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});
