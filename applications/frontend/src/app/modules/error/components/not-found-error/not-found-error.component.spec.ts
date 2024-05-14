import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NotFoundErrorComponent } from './not-found-error.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NotFoundErrorComponent', () => {
  let component: NotFoundErrorComponent;
  let fixture: ComponentFixture<NotFoundErrorComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [NotFoundErrorComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundErrorComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
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
