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
    this.form = this.createForm();
  }

  /**
   * Initializes the contact form with validation rules.
   * @returns {FormGroup} The initialized form group.
   */
  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      sendCopy: [false],
      contactByFax: [null],
    });
  }

  /**
   * Convenience getter for easy access to form controls.
   * @returns {any} The form controls.
   */
  get f() {
    return this.form.controls;
  }

  /**
   * Sends the contact form data if the form is valid.
   * If the form is invalid, it marks all controls as touched to show validation errors.
   */
  send(): void {
    if (this.form.invalid) {
      this.markFormAsTouched();
      return;
    }

    const formData = this.form.value;
    this.sendEmail(formData);
  }

  /**
   * Marks all form controls as touched to trigger validation messages.
   */
  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
  }

  /**
   * Sends the form data to the API and handles the response.
   * @param {any} formData The form data to be sent.
   */
  private sendEmail(formData: any): void {
    this.apiClient.post('send_email', formData).subscribe({
      next: (data) => this.handleSuccess(data),
      error: (error) => this.handleError(error),
    });
  }

  /**
   * Handles the successful email sending response.
   * @param {any} data The response data.
   */
  private handleSuccess(data: any): void {
    console.log(data);
    this.emailIsSend = true;
    this.form.reset();
  }

  /**
   * Handles errors that occur during the email sending process.
   * @param {any} error The error object.
   */
  private handleError(error: any): void {
    console.error('There was an error!', error);
  }
}
