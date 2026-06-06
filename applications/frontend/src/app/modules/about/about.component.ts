import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { AboutService } from '@modules/about/about.service';
import type { ITechCategory } from '@modules/about/about.models';
import { PmAsyncContentComponent } from '@shared/components/pm-async-content/pm-async-content.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { GibberishRevealDirective } from '@shared/directives/gibberish-reveal.directive';
import { toLoadStatusSignals } from '@app/shared/models/load-status.signals';

@Component({
  selector: 'app-about',
  imports: [PmAsyncContentComponent, ScrollRevealDirective, GibberishRevealDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private aboutService = inject(AboutService);

  readonly skills = toSignal(this.aboutService.tech$, {
    initialValue: [] as ITechCategory[],
  });
  private readonly techLoad = toLoadStatusSignals(this.aboutService.techState$);
  readonly techLoadStatus = this.techLoad.loadStatus;
  readonly techError = this.techLoad.error;

  retryTechLoad(): void {
    this.aboutService.reloadTechstack();
  }

  technicSkills = [
    'BEM',
    'Styleguide Driven Development',
    'Responsive Design',
    'Test Driven Development',
  ];

  softSkills = [
    'Scrum',
    'Erfahrung in deutsch- und englischsprachigen Teams',
    'Refactoring',
    'Konzeption, Design und Umsetzung von Frontend-Architekturen',
    'Nachhaltige Softwareentwicklung',
  ];

  workProcess = [
    {
      step: '01',
      title: 'Kennenlernen',
      text: 'Kurzes Gespräch oder Nachricht: Was soll erreicht werden, wer ist beteiligt, welcher Zeitrahmen steht im Raum?',
    },
    {
      step: '02',
      title: 'Einordnung',
      text: 'Ich schaue mir Bestand, Team und Rahmenbedingungen an — ehrlich, ohne Sales-Pitch. Passt es nicht, sage ich das.',
    },
    {
      step: '03',
      title: 'Umsetzung',
      text: 'Iterativ in engen Zyklen: Design und Code zusammen, reviewbar, mit klarem Fokus auf wartbares Frontend.',
    },
    {
      step: '04',
      title: 'Übergabe',
      text: 'Dokumentation, Wissenstransfer, sauberer Stand — damit du (oder ich später) ohne Bruch weiterarbeiten kannst.',
    },
  ];

  whatIAmGoodAt = [
    'Produkte mit Leben erfüllen',
    'Spannende und schräge Designs',
    'Frontend-Lösungen und Design Systems',
    'Automatisierung',
    'Persönlichkeit in Services integrieren',
    'Progressive Web Apps (PWAs)',
    'Vollständige Lösungen von Frontend bis Backend',
    'Integrationen',
    'Internet of Things',
  ];

  years(data: number = 0): string {
    const roundedYears = Math.round(data);
    if (roundedYears > 0) {
      return roundedYears > 1 ? `${roundedYears}+ Jahre` : `${roundedYears}+ Jahr`;
    }

    const months = Math.round(data * 12);
    if (months <= 0) {
      return '';
    }

    return months > 1 ? `${months} Monate` : `${months} Monat`;
  }
}
