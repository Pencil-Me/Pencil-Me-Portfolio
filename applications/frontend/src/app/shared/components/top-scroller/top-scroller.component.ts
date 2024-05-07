import { Component } from '@angular/core';
import { ScrollAnchorDirective } from '@shared/directives/scroll-anchor.directive';

@Component({
  selector: 'app-top-scroller',
  standalone: true,
  imports: [ScrollAnchorDirective],
  templateUrl: './top-scroller.component.html',
  styleUrl: './top-scroller.component.scss',
})
export class TopScrollerComponent {}
