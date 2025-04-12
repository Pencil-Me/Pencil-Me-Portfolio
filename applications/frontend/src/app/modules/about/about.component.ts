import { Component, inject } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { AboutService } from '@modules/about/about.service';
import { Observable } from 'rxjs';
import { ITechCategory } from '@modules/about/about.models';

@Component({
    selector: 'app-about',
    imports: [NgForOf, NgIf],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {
  private aboutService = inject(AboutService);
  private skills$: Observable<ITechCategory[]> = this.aboutService.tech$;

  // Array to hold the technical skills fetched from the service
  skills: ITechCategory[] = [];

  // Predefined lists of skills and areas of expertise
  technicSkills = ['BEM', 'Styleguide Driven Development', 'Responsive Design', 'Test Driven Development'];

  softSkills = [
    'Scrum',
    'Erfahrung in deutsch- und englischsprachigen Teams',
    'Refactoring',
    'Konzeption, Design und Umsetzung von Frontend-Architekturen',
    'nachhaltige Software-Entwicklung',
  ];

  whatIAmGoodAt = [
    'Produkte mit Leben erfüllen',
    'Spannende und Skurrile Designs',
    'Frontend Lösungen',
    'Automation',
    'Persönlichkeit in Services integrieren',
    'Progressive Web Apps (PWAs)',
    'Vollständige Lösungen, Front- bis Backend',
    'Integrationen',
    'Internet Of Things',
  ];

  // Constructor to initialize the component and subscribe to the skills observable
  constructor() {
    this.subscribeToSkills();
  }

  years(data: number = 0): string {
    let returnValue = Math.round(data) > 1 ? `${Math.round(data)}+ Jahre` : `${Math.round(data)}+ Jahr`;
    if (Math.round(data) <= 0) returnValue = Math.round(data * 12) > 1 ? `${data * 12} Monate` : `${data * 12} Monat`;
    if (data * 12 <= 0) return '';
    return returnValue;
  }

  /**
   * Subscribes to the skills observable from the AboutService
   * and updates the local skills array when new data is emitted.
   */
  private subscribeToSkills(): void {
    this.skills$.subscribe((skills) => {
      this.skills = skills;
    });
  }
}
