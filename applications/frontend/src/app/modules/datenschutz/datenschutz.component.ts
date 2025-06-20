import { Component } from '@angular/core';

@Component({
  selector: 'app-datenschutz',
  imports: [],
  templateUrl: './datenschutz.component.html',
  styleUrl: './datenschutz.component.scss',
})
export class DatenschutzComponent {
  email: string = 'info@pencil-me.de';
  encryptedEmail: string = this.encryptEmail(this.email);

  /**
   * Encrypts the email address by replacing '@' with '[at]'.
   * This is a simple obfuscation technique to prevent spam bots from harvesting the email address.
   * @param email - The email address to be encrypted.
   * @returns The encrypted email address.
   */
  private encryptEmail(email: string): string {
    return email.replace('@', '[at]');
  }
}
