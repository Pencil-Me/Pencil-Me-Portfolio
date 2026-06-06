import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HomeService } from '@modules/home/home.service';
import { RouterLink } from '@angular/router';
import type { ITechCategories } from '@modules/home/home.models';
import { CountUpDirective } from '@shared/directives/count-up.directive';
import { TrackVisibilityDirective } from '@shared/directives/track-visibility.directive';
import { FeaturedProjectsComponent } from '@shared/components/featured-projects/featured-projects.component';
import { PmAsyncContentComponent } from '@shared/components/pm-async-content/pm-async-content.component';
import { toLoadStatusSignals } from '@app/shared/models/load-status.signals';
import { ParallaxDirective } from '@shared/directives/parallax.directive';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { GibberishRevealDirective } from '@shared/directives/gibberish-reveal.directive';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    NgOptimizedImage,
    CountUpDirective,
    TrackVisibilityDirective,
    FeaturedProjectsComponent,
    PmAsyncContentComponent,
    ParallaxDirective,
    ScrollRevealDirective,
    GibberishRevealDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnDestroy {
  private homeService = inject(HomeService);

  readonly techStack = toSignal(this.homeService.tech$, {
    initialValue: [] as ITechCategories[],
  });
  readonly customers = toSignal(this.homeService.customers$, {
    initialValue: [] as { url: string; alt: string }[],
  });
  private readonly techLoad = toLoadStatusSignals(this.homeService.techState$);
  readonly techLoadStatus = this.techLoad.loadStatus;
  readonly techError = this.techLoad.error;

  private readonly customersLoad = toLoadStatusSignals(this.homeService.customersState$);
  readonly customersLoadStatus = this.customersLoad.loadStatus;
  readonly customersError = this.customersLoad.error;

  roles = ['Frontend-Entwickler', 'UI/UX-Designer', 'Fullstack-Entwickler', 'Problemlöser'];
  currentRole = this.roles[0];
  readonly currentRoleVisual = signal('');

  private timeouts: ReturnType<typeof setTimeout>[] = [];

  typewriterConfig = {
    speed: 50,
    changeSpeed: 2000,
    positionIndex: 0,
  };

  counter = {
    years: 20,
    projects: 90,
    customers: 80,
  };

  readonly containerIsVisible = signal(false);

  constructor() {
    this.startTypeWriter();
  }

  ngOnDestroy(): void {
    this.timeouts.forEach((t) => clearTimeout(t));
    this.timeouts = [];
  }

  onStatsVisible(visible: boolean): void {
    if (visible) {
      this.containerIsVisible.set(true);
    }
  }

  retryTechLoad(): void {
    this.homeService.reloadTechstack();
  }

  retryCustomersLoad(): void {
    this.homeService.reloadCustomers();
  }

  private startTypeWriter(): void {
    this.typeWriter.add();
  }

  typeWriter = {
    add: (): void => {
      if (this.typewriterConfig.positionIndex < this.currentRole.length) {
        this.currentRoleVisual.update(
          (value) => value + this.currentRole.charAt(this.typewriterConfig.positionIndex),
        );
        this.typewriterConfig.positionIndex++;
        this.scheduleTimeout(() => this.typeWriter.add(), this.typewriterConfig.speed);
      } else {
        this.scheduleTimeout(() => this.typeWriter.remove(), this.typewriterConfig.changeSpeed);
      }
    },

    remove: (): void => {
      if (this.typewriterConfig.positionIndex > 0) {
        this.currentRoleVisual.update((value) => value.slice(0, -1));
        this.typewriterConfig.positionIndex--;
        this.scheduleTimeout(() => this.typeWriter.remove(), this.typewriterConfig.speed);
      } else {
        this.typeWriter.selectNext();
      }
    },

    selectNext: (): void => {
      let role = this.typeWriter.getRandomRole();
      while (role === this.currentRole) role = this.typeWriter.getRandomRole();
      this.currentRole = role;
      this.currentRoleVisual.set('');
      this.typewriterConfig.positionIndex = 0;
      this.typeWriter.add();
    },

    getRandomRole: (): string => {
      return this.roles[Math.floor(Math.random() * this.roles.length)];
    },
  };

  private scheduleTimeout(callback: () => void, delayMs: number): void {
    const timeoutId = setTimeout(callback, delayMs);
    this.timeouts.push(timeoutId);
  }
}
