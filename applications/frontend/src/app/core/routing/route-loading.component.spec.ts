import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { RouteLoadingComponent } from './route-loading.component';
import { RouteLoadingService } from './route-loading.service';

describe('RouteLoadingComponent', () => {
  let fixture: ComponentFixture<RouteLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteLoadingComponent],
      providers: [
        RouteLoadingService,
        { provide: Router, useValue: { events: new Subject() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteLoadingComponent);
    fixture.detectChanges();
  });

  it('should create and expose route loading service', () => {
    expect(fixture.componentInstance.routeLoading).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.pm-route-loading')).toBeTruthy();
  });
});
