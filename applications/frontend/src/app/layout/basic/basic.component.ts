import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@layout/components/navigation/navigation.component';
import { FooterComponent } from '@layout/components/footer/footer.component';
import { TopScrollerComponent } from '@shared/components/top-scroller/top-scroller.component';
import { ScrollSectionDirective } from '@shared/directives/scroll-section.directive';
import { ScrollManagerDirective } from '@shared/directives/scroll-manager.directive';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-basic',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent,
    FooterComponent,
    TopScrollerComponent,
    ScrollSectionDirective,
    ScrollManagerDirective,
    NgIf,
    NgClass,
  ],
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.scss',
})
export class BasicComponent {
  showScrollToTop = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowScrollPosition = window.scrollY;
    let distanceToBottom = document.body.scrollHeight - (window.innerHeight + window.scrollY);

    // Wenn distanceToBottom negativ ist, setzen wir es auf einen Mindestwert von 0
    if (distanceToBottom < 0) distanceToBottom = 0;

    this.showScrollToTop = windowScrollPosition > 200 && distanceToBottom > 400;
  }
  onDeactivate() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
