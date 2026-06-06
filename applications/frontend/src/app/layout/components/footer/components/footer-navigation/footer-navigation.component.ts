import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-footer-navigation',
  imports: [RouterLink],
  styleUrl: './footer-navigation.component.scss',
  templateUrl: './footer-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterNavigationComponent {
  @Input() navLinks: NavLink[] = [];
}
