import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { ProjectDateRangeComponent } from './project-date-range.component';

describe('ProjectDateRangeComponent', () => {
  let fixture: ComponentFixture<ProjectDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDateRangeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDateRangeComponent);
  });

  it('should render formatted project date ranges', () => {
    fixture.componentRef.setInput('dates', [
      { start_date: 'Jan.2020', end_date: 'Jan.2021' },
      { start_date: 'Mär.2022', end_date: 'heute' },
    ]);
    fixture.detectChanges();

    const ranges = fixture.nativeElement.querySelectorAll('.project-panel__date');
    expect(ranges.length).toBe(2);
    expect(ranges[0].textContent).toContain('Jan.2020');
    expect(ranges[1].textContent).toContain('heute');
  });

  it('should render nothing when dates are empty', () => {
    fixture.componentRef.setInput('dates', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.project-panel__meta')).toBeNull();
  });
});
