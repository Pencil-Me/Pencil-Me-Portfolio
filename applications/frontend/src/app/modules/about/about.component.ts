import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe, NgForOf, NgIf, NgStyle } from '@angular/common';
import { AboutService } from '@modules/about/about.service';
import { Observable } from 'rxjs';
import { ITechCategory } from '@modules/about/about.models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NgForOf, JsonPipe, NgIf, AsyncPipe, NgStyle],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  private aboutService = inject(AboutService);
  private skills$: Observable<ITechCategory[]> = this.aboutService.tech$;

  skills: ITechCategory[] = [];
  technicSkills = ['BEM', 'Styleguide Driven Development', 'Responsive Design', 'Test Driven Development'];
  softSkills = ['Scrum', 'Erfahrung in deutsch- und englischsprachigen Teams', 'Refactorings', 'Konzeption von Frontend-Architekturen'];
  whatIAmGoodAt = [
    'Produkte mit Leben erfüllen',
    'Spannende und Skurrile Designs',
    'Frontend-Lösungen',
    'Automation',
    'Persönlichkeit in Services integrieren',
    'PWAs (Progressive Web Apps)',
    'Vollständige Lösungen, Front- bis Backend',
    'Integrationen',
    'Internet Of Things',
  ];

  constructor() {
    this.skills$.subscribe((e) => (this.skills = e));
  }
}
