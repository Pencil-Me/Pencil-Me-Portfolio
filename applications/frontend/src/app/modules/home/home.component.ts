import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from '@modules/home/home.service';
import { RouterLink } from '@angular/router';
import { ITechCategories } from '@modules/home/home.models';
import { CountUpDirective } from '@shared/directives/count-up.directive';
import { TrackVisibilityDirective } from '@shared/directives/track-visibility.directive';

@Component({
    selector: 'app-home',
    imports: [NgForOf, RouterLink, NgOptimizedImage, CountUpDirective, TrackVisibilityDirective, NgIf],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  private homeService = inject(HomeService);

  techStack$: Observable<ITechCategories[]> = this.homeService.tech$;
  customers$: Observable<{ url: string; alt: string }[]> = this.homeService.customers$;

  roles = [
    'Frontend-Developer',
    'Mobile Developer',
    'Fullstack-Developer',
    'Grafik Designer',
    'Webdesigner',
    'Problemlöser',
    'Katzenmensch',
    'UI/UX Designer',
  ];
  currentRole = this.roles[0];
  currentRoleVisual = '';
  typewriterConfig = {
    speed: 50,
    changeSpeed: 2000,
    positionIndex: 0,
  };
  techStack: ITechCategories[] = [];
  customers: { url: string; alt: string }[] = [];
  counter = {
    years: 20,
    projects: 90,
    customers: 80,
  };

  constructor() {
    this.subscribeToObservables();
    this.startTypeWriter();
  }
  containerIsVisible: boolean = false;
  test(a: boolean) {
    if (a) this.containerIsVisible = true;
  }

  /**
   * Subscribes to the tech stack and customers observables from the HomeService.
   */
  private subscribeToObservables(): void {
    this.techStack$.subscribe((techStack) => (this.techStack = techStack));
    this.customers$.subscribe((customers) => (this.customers = customers));
  }

  /**
   * Starts the typewriter effect.
   */
  private startTypeWriter(): void {
    this.typeWriter.add();
  }

  typeWriter = {
    /**
     * Adds characters to the visual representation of the current role.
     */
    add: () => {
      if (this.typewriterConfig.positionIndex < this.currentRole.length) {
        this.currentRoleVisual += this.currentRole.charAt(this.typewriterConfig.positionIndex);
        this.typewriterConfig.positionIndex++;
        setTimeout(() => this.typeWriter.add(), this.typewriterConfig.speed);
      } else {
        setTimeout(() => this.typeWriter.remove(), this.typewriterConfig.changeSpeed);
      }
    },

    /**
     * Removes characters from the visual representation of the current role.
     */
    remove: () => {
      if (this.typewriterConfig.positionIndex > 0) {
        this.currentRoleVisual = this.currentRoleVisual.slice(0, -1);
        this.typewriterConfig.positionIndex--;
        setTimeout(() => this.typeWriter.remove(), this.typewriterConfig.speed);
      } else {
        this.typeWriter.selectNext();
      }
    },

    /**
     * Selects the next role to display.
     */
    selectNext: () => {
      let role = this.typeWriter.getRandomRole();
      while (role === this.currentRole) role = this.typeWriter.getRandomRole();
      this.currentRole = role;
      this.currentRoleVisual = '';
      this.typewriterConfig.positionIndex = 0;
      this.typeWriter.add();
    },

    /**
     * Gets a random role from the roles array.
     * @returns A random role.
     */
    getRandomRole: () => {
      return this.roles[Math.floor(Math.random() * this.roles.length)];
    },
  };
}
