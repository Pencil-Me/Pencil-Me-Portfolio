import { Component } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import type { LoadStatus } from '@app/shared/models/load-status.model';

import { PmAsyncContentComponent, type PmAsyncVariant } from './pm-async-content.component';

@Component({
  template: `
    <app-pm-async-content
      [status]="status"
      [error]="error"
      [variant]="variant"
      [label]="label"
      [showRetry]="showRetry"
      (retry)="onRetry()"
    >
      <p class="projected-content">Loaded content</p>
    </app-pm-async-content>
  `,
  imports: [PmAsyncContentComponent],
})
class HostComponent {
  status: LoadStatus = 'PENDING';
  error: unknown = null;
  variant: PmAsyncVariant = 'spinner';
  label = 'Lade Daten';
  showRetry = false;
  retryCount = 0;

  onRetry(): void {
    this.retryCount++;
  }
}

describe('PmAsyncContentComponent', () => {
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  function projectedContent(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.projected-content');
  }

  it('should show spinner placeholder for PENDING status', () => {
    host.status = 'PENDING';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.pm-async-content__spinner')).toBeTruthy();
    expect(projectedContent()).toBeNull();
  });

  it('should show loading placeholder for LOADING status', () => {
    host.status = 'LOADING';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeTruthy();
    expect(projectedContent()).toBeNull();
  });

  it('should show error box for ERROR status and hide projected content', () => {
    host.status = 'ERROR';
    host.error = 'Server nicht erreichbar.';
    fixture.detectChanges();

    const errorBox = fixture.nativeElement.querySelector('.pm-load-error');
    expect(errorBox).toBeTruthy();
    expect(errorBox.textContent).toContain('Server nicht erreichbar.');
    expect(projectedContent()).toBeNull();
  });

  it('should project content for COMPLETED status', () => {
    host.status = 'COMPLETED';
    fixture.detectChanges();

    expect(projectedContent()?.textContent).toContain('Loaded content');
    expect(fixture.nativeElement.querySelector('.pm-load-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('should render skill-grid placeholder for skill-grid variant', () => {
    host.status = 'LOADING';
    host.variant = 'skill-grid';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.pm-async-content__skill-grid')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.pm-async-content__ticker')).toBeNull();
  });

  it('should render ticker placeholder for ticker variant', () => {
    host.status = 'LOADING';
    host.variant = 'ticker';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.pm-async-content__ticker')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.pm-async-content__skill-grid')).toBeNull();
  });

  it('should render featured, chips, project-grid and detail placeholders', () => {
    const cases: PmAsyncVariant[] = ['featured', 'chips', 'project-grid', 'detail'];

    cases.forEach((variant) => {
      host.status = 'LOADING';
      host.variant = variant;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(`.pm-async-content__${variant}`)).toBeTruthy();
    });
  });

  it('should show error box for legacy COMPLETED status with error payload', () => {
    host.status = 'COMPLETED';
    host.error = 'Legacy failure';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.pm-load-error')).toBeTruthy();
    expect(projectedContent()).toBeNull();
  });

  it('should emit retry when retry button is clicked', () => {
    host.status = 'ERROR';
    host.error = 'Fehler';
    host.showRetry = true;
    fixture.detectChanges();

    const retryButton = fixture.debugElement.query(By.css('.pm-load-error__retry'));
    retryButton.nativeElement.click();

    expect(host.retryCount).toBe(1);
  });
});
