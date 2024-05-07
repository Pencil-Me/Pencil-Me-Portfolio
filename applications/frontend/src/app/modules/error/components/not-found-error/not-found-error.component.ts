import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found-error.component.html',
})
export class NotFoundErrorComponent {
  constructor(private router: Router) {}
  returnToHome() {
    this.router.navigate(['/']);
  }
}
