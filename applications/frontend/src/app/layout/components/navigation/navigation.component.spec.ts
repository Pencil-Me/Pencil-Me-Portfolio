import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RoutePrefetchService } from '@core/routing/route-prefetch.service';
import { ThemeService } from '@app/core/services/theme/theme.service';

import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let themeService: ThemeService;
  let routePrefetch: jasmine.SpyObj<RoutePrefetchService>;
  let routerEvents$: Subject<unknown>;

  beforeEach(async () => {
    routerEvents$ = new Subject();
    routePrefetch = jasmine.createSpyObj('RoutePrefetchService', ['prefetch']);

    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        { provide: Router, useValue: { events: routerEvents$ } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            queryParams: of({}),
          },
        },
        { provide: RoutePrefetchService, useValue: routePrefetch },
        {
          provide: ThemeService,
          useFactory: () => {
            const service = new ThemeService();
            spyOn(service, 'init').and.callThrough();
            spyOn(service, 'toggle').and.callThrough();
            return service;
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  afterEach(() => {
    routerEvents$.complete();
  });

  it('should create and initialize theme', () => {
    expect(component).toBeTruthy();
    expect(themeService.init).toHaveBeenCalled();
  });

  it('should toggle collapsed state', () => {
    expect(component.isCollapsed()).toBeTrue();

    component.toggleCollapsed();
    expect(component.isCollapsed()).toBeFalse();

    component.toggleCollapsed();
    expect(component.isCollapsed()).toBeTrue();
  });

  it('should collapse navigation on NavigationStart', () => {
    component.toggleCollapsed();
    expect(component.isCollapsed()).toBeFalse();

    routerEvents$.next(new NavigationStart(1, '/about', 'imperative'));

    expect(component.isCollapsed()).toBeTrue();
  });

  it('should toggle theme via theme service', () => {
    component.toggleTheme();
    expect(themeService.toggle).toHaveBeenCalled();
  });

  it('should format nav index with leading zero', () => {
    expect(component.formatNavIndex(0)).toBe('01');
    expect(component.formatNavIndex(9)).toBe('10');
  });

  it('should prefetch route target', () => {
    component.prefetchRoute('about');
    expect(routePrefetch.prefetch).toHaveBeenCalledWith('about');
  });

  it('should set sticky when scrolled past threshold', () => {
    const scrollYSpy = spyOnProperty(window, 'scrollY', 'get');

    scrollYSpy.and.returnValue(0);
    component.onWindowScroll();
    expect(component.sticky()).toBeFalse();

    scrollYSpy.and.returnValue(201);
    component.onWindowScroll();
    expect(component.sticky()).toBeTrue();
  });
});
