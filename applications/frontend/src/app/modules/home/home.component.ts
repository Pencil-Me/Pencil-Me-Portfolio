import { AsyncPipe, JsonPipe, NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from '@modules/home/home.service';
import { RouterLink } from '@angular/router';
import { ITechCategories } from '@modules/home/home.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgForOf, AsyncPipe, RouterLink, JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private homeService = inject(HomeService);

  private techStack$: Observable<ITechCategories[]> = this.homeService.tech$;
  private customers$: Observable<string[]> = this.homeService.customers$;

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
  customers: string[] = [];

  constructor() {
    this.techStack$.subscribe((e) => (this.techStack = e));
    this.customers$.subscribe((e) => (this.customers = e));
    this.typeWriter.add();
  }

  typeWriter = {
    add: () => {
      if (this.typewriterConfig.positionIndex < this.currentRole.length) {
        this.currentRoleVisual += this.currentRole.charAt(this.typewriterConfig.positionIndex);
        this.typewriterConfig.positionIndex++;
        setTimeout(() => this.typeWriter.add(), this.typewriterConfig.speed);
      } else {
        setTimeout(() => {
          this.typeWriter.remove();
        }, this.typewriterConfig.changeSpeed);
      }
    },
    remove: () => {
      if (this.typewriterConfig.positionIndex > 0) {
        this.currentRoleVisual = this.currentRoleVisual.slice(0, -1);
        this.typewriterConfig.positionIndex--;
        setTimeout(() => this.typeWriter.remove(), this.typewriterConfig.speed);
      } else {
        this.typeWriter.selectNext();
      }
    },
    selectNext: () => {
      let role = this.typeWriter.getRandomRole();
      while (role === this.currentRole) role = this.typeWriter.getRandomRole();
      this.currentRole = role;
      this.currentRoleVisual = '';
      this.typewriterConfig.positionIndex = 0;
      this.typeWriter.add();
    },
    getRandomRole: () => {
      return this.roles[Math.floor(Math.random() * this.roles.length)];
    },
  };
}
