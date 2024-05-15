import { Component } from '@angular/core';

@Component({
  selector: 'app-impressum',
  standalone: true,
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.scss'],
})
export class ImpressumComponent {
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
