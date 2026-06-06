import { isPrefetchableRoute, routeLoaders } from './route-loaders';

describe('route-loaders', () => {
  it('should identify prefetchable routes', () => {
    expect(isPrefetchableRoute('about')).toBeTrue();
    expect(isPrefetchableRoute('project-details')).toBeTrue();
    expect(isPrefetchableRoute('unknown')).toBeFalse();
  });

  const loaderCases = [
    ['contact', routeLoaders.contact],
    ['about', routeLoaders.about],
    ['projects', routeLoaders.projects],
    ['project-details', routeLoaders['project-details']],
    ['impressum', routeLoaders.impressum],
    ['datenschutz', routeLoaders.datenschutz],
  ] as const;

  loaderCases.forEach(([name, loader]) => {
    it(`should lazy-load ${name} component`, async () => {
      const component = await loader();
      expect(component).toBeTruthy();
    });
  });
});
