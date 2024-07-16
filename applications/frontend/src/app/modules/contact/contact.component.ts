import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiClientService } from '@core/services/api/api-client.service';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink, NgTemplateOutlet],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  generally_form: FormGroup;
  project_form: FormGroup;
  emailIsSend: boolean = false;
  email: string = 'info@pencil-me.de';
  encryptedEmail: string = this.encryptEmail(this.email);
  contactForm: null | 'GENERALLY' | 'PROJECT' = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiClient: ApiClientService,
  ) {
    this.generally_form = this.createGenerallyForm();
    this.project_form = this.createProjectForm();
  }

  /**
   * Initializes the contact form with validation rules.
   * @returns {FormGroup} The initialized form group.
   */
  private createGenerallyForm(): FormGroup {
    return this.formBuilder.group({
      generally_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      generally_email: ['', [Validators.required, Validators.email]],
      generally_message: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      generally_sendCopy: [false],
      project_yes: [false],
      generally_contactByFax: [null],
    });
  }

  /**
   * Initializes the contact form with validation rules.
   * @returns {FormGroup} The initialized form group.
   */
  private createProjectForm(): FormGroup {
    return this.formBuilder.group({
      project_company: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      project_contact_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      project_phone: ['', [Validators.required, Validators.email]],
      project_email: ['', [Validators.required, Validators.email]],
      project_message: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      project_address: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      project_title: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      project_description: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      project_timeline: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      project_sendCopy: [false],
      project_yes: [false],
      project_contactByFax: [null],
    });
  }

  /**
   * Convenience getter for easy access to form controls.
   * @returns {any} The form controls.
   */
  get f() {
    return this.generally_form.controls;
  }

  /**
   * Sends the contact form generally data if the form is valid.
   * If the form is invalid, it marks all controls as touched to show validation errors.
   */
  generally_send(): void {
    if (this.generally_form.invalid) {
      this.markFormAsTouched();
      return;
    }

    const formData = this.generally_form.value;
    this.sendEmail(formData);
  }

  /**
   * Marks all form controls as touched to trigger validation messages.
   */
  private markFormAsTouched(): void {
    this.generally_form.markAllAsTouched();
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
    this.emailIsSend = true;
    this.generally_form.reset();
    this.project_form.reset();
  }

  /**
   * Handles errors that occur during the email sending process.
   * @param {any} error The error object.
   */
  private handleError(error: any): void {
    console.error('There was an error!', error);
  }

  /**
   * Sends the contact form project data if the form is valid.
   * If the form is invalid, it marks all controls as touched to show validation errors.
   */
  project_send(): void {
    if (this.project_form.invalid) {
      this.markFormAsTouched();
      return;
    }

    const formData = this.project_form.value;
    this.sendEmail(formData);
  }

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
