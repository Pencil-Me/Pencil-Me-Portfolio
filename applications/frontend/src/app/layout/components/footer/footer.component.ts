import { Component } from '@angular/core';
import { TopScrollerComponent } from '@shared/components/top-scroller/top-scroller.component';
import { RouterLink } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TopScrollerComponent, RouterLink, NgForOf],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  techStackForPortfolio: { name: string; version: string }[] = [
    { name: 'Angular', version: 'v17.0' },
    { name: 'Bootstrap', version: 'v5.3' },
    { name: 'NGRX', version: 'v17.1' },
    { name: 'MySQL', version: '' },
    { name: 'PHP', version: 'v8.1' },
  ];

  /**
   * Returns the current year as a string.
   */
  getCurrentYear(): string {
    return new Date().getFullYear().toString();
  }
}
