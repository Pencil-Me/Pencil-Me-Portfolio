import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';

import { ScrollManagerDirective } from '@shared/directives/scroll-manager.directive';

import { TopScrollerComponent } from './top-scroller.component';

describe('TopScrollerComponent', () => {
  let component: TopScrollerComponent;
  let fixture: ComponentFixture<TopScrollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopScrollerComponent],
      providers: [
        {
          provide: ScrollManagerDirective,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
