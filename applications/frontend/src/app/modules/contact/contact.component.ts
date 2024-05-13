import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiClientService } from '@core/services/api/api-client.service';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  form: FormGroup;
  emailIsSend: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiClient: ApiClientService,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      sendCopy: [false],
      contactByFax: [null],
    });
  }

  get f() {
    return this.form.controls;
  }

  send(): void {
    if (this.form.invalid) {
      // Überprüfen, ob das Formular gültig ist und Fehlermeldungen anzeigen
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, message, sendCopy, contactByFax } = this.form.value;
    this.apiClient
      .post('send_email', {
        name,
        email,
        message,
        sendCopy,
        contactByFax,
      })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.emailIsSend = true;
          this.form.reset();
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
      });
  }
}
