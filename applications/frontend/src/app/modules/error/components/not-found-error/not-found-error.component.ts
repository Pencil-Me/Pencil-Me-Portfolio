import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The NotFoundErrorComponent is responsible for displaying
 * the "404 Not Found" error message and providing a button
 * to return to the home page.
 */
@Component({
    selector: 'app-not-found',
    templateUrl: './not-found-error.component.html',
    standalone: false
})
export class NotFoundErrorComponent {
  constructor(private router: Router) {}

  /**
   * Navigates the user back to the home page.
   */
  returnToHome() {
    this.router.navigate(['/']);
  }
}
