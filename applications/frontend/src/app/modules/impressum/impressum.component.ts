import { Component } from '@angular/core';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [],
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.scss',
})
export class ImpressumComponent {
  email: string = 'info@pencil-me.de';
  encryptedEmail: string = this.encryptEmail(this.email);

  encryptEmail(email: string): string {
    return email
      .split('')
      .map((char) => {
        if (char === '@') {
          return '[at]';
        } else {
          return char;
        }
      })
      .join('');
  }
}
