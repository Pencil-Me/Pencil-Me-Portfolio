import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pm-logo',
  imports: [RouterLink],
  templateUrl: './pm-logo.component.html',
  styleUrl: './pm-logo.component.scss',
})
export class PmLogoComponent {
  @Input() compact = false;
}
