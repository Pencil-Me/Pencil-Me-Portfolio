import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { NotFoundErrorComponent } from './not-found-error.component';

describe('NotFoundErrorComponent', () => {
  let component: NotFoundErrorComponent;
  let fixture: ComponentFixture<NotFoundErrorComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NotFoundErrorComponent],
      providers: [{ provide: Router, useValue: router }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home when returnToHome is called', () => {
    component.returnToHome();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
