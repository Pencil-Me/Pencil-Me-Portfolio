import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import type { ActivatedRouteSnapshot } from '@angular/router';
import { SeoGuard } from './seo.guard';

describe('SeoGuard', () => {
  let guard: SeoGuard;
  let title: Title;
  let meta: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SeoGuard);
    title = TestBed.inject(Title);
    meta = TestBed.inject(Meta);
    spyOn(title, 'setTitle');
    spyOn(meta, 'updateTag');
  });

  it('should apply route seo metadata', () => {
    const route = {
      data: {
        title: 'About',
        description: 'About page',
        keywords: 'portfolio,about',
        ogTitle: 'About OG',
        ogDescription: 'About description',
        ogUrl: 'https://example.test/about',
        ogType: 'website',
      },
    } as unknown as ActivatedRouteSnapshot;

    expect(guard.canActivate(route, {} as never)).toBeTrue();
    expect(title.setTitle).toHaveBeenCalledWith('About');
    expect(meta.updateTag).toHaveBeenCalledWith(
      jasmine.objectContaining({ name: 'description', content: 'About page' }),
    );
    expect(meta.updateTag).toHaveBeenCalledWith(
      jasmine.objectContaining({ property: 'og:title', content: 'About OG' }),
    );
  });
});
