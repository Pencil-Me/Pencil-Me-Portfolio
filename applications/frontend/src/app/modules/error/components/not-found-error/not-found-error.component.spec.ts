import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { NotFoundErrorComponent } from './not-found-error.component';

describe('NotFoundErrorComponent', () => {
  let component: NotFoundErrorComponent;

  let routerMock: Router;

  beforeEach(() => {
    routerMock = TestBed.inject(Router);
    component = new NotFoundErrorComponent(routerMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
