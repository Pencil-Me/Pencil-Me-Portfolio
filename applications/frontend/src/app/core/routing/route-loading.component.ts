import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RouteLoadingService } from '@core/routing/route-loading.service';

@Component({
  selector: 'app-route-loading',
  template: `
    <div class="pm-route-loading" role="status" aria-live="polite" aria-label="Seite wird geladen">
      <div class="pm-loader">
        <span class="pm-loader__ring" aria-hidden="true"></span>
        <span class="pm-loader__label">Lade Seite</span>
      </div>
    </div>
  `,
  styleUrl: './route-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteLoadingComponent {
  readonly routeLoading = inject(RouteLoadingService);
}
