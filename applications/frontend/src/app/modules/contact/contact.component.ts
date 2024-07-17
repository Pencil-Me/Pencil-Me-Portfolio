import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiClientService } from '@core/services/api/api-client.service';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {faEnvelope} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink, NgTemplateOutlet, FaIconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  generally_form: FormGroup;
  project_form: FormGroup;
  emailIsSend: boolean = false;
  emailSending: boolean = false;
  emailHasError: boolean = false;
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
      generally_yes: [false, [Validators.required, Validators.requiredTrue]],
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
      project_contactName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      project_phone: [''],
      project_email: ['', [Validators.required, Validators.email]],
      project_address: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      project_title: ['', [Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      project_description: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      project_timeline: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9!@#$%^&*(),.?":{}|<> ]*')]],
      project_sendCopy: [false],
      project_yes: [false, [Validators.required, Validators.requiredTrue]],
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
    if (this.generally_form.invalid || this.generally_form.get('generally_yes')?.value === false) {
      this.markGenerallyFormAsTouched();
      return;
    }

    const formData = {
      contactByFax: this.generally_form.get('generally_contactByFax')?.value,
      email: this.generally_form.get('generally_email')?.value,
      message: this.generally_form.get('generally_message')?.value,
      name: this.generally_form.get('generally_name')?.value,
      sendCopy: this.generally_form.get('generally_sendCopy')?.value,
    };

    this.sendEmail(formData);
  }

  /**
   * Marks all form controls as touched to trigger validation messages.
   */
  private markGenerallyFormAsTouched(): void {
    this.generally_form.markAllAsTouched();
  }

  /**
   * Sends the contact form project data if the form is valid.
   * If the form is invalid, it marks all controls as touched to show validation errors.
   */
  project_send(): void {
    if (this.project_form.invalid || this.project_form.get('project_yes')?.value === false) {
      this.markProjectFormAsTouched();
      return;
    }

    const formData = {
      contactByFax: this.project_form.get('project_contactByFax')?.value,
      email: this.project_form.get('project_email')?.value,
      message: `Unternehmen: ${this.project_form.get('project_company')?.value},
      Kontaktname: ${this.project_form.get('project_contactName')?.value},
      Telefon: ${this.project_form.get('project_phone')?.value},
      Email: ${this.project_form.get('project_email')?.value},
      Adresse: ${this.project_form.get('project_address')?.value}
      -------------------------------------------------------
      Projekttitel: ${this.project_form.get('project_title')?.value},
      Beschreibung: ${this.project_form.get('project_description')?.value},
      Timeline: ${this.project_form.get('project_timeline')?.value},
      `,
      name: `${this.project_form.get('project_contactName')?.value} - ${this.project_form.get('project_company')?.value}`,
      sendCopy: this.project_form.get('project_sendCopy')?.value,
    };
    console.log(formData)
    this.sendEmail(formData);
  }

  /**
   * Marks all form controls as touched to trigger validation messages.
   */
  private markProjectFormAsTouched(): void {
    this.project_form.markAllAsTouched();
  }

  /**
   * Sends the form data to the API and handles the response.
   * @param {any} formData The form data to be sent.
   */
  private sendEmail(formData: any): void {
    console.log(formData);
    this.emailSending = true;
    setTimeout(() => this.apiClient.post('send_email', formData).subscribe({
      next: (data) => this.handleSuccess(data),
      error: (error) => this.handleError(error),
    }), 50000)

  }

  /**
   * Handles the successful email sending response.
   * @param {any} data The response data.
   */
  private handleSuccess(data: any): void {
    this.emailIsSend = true;
    this.emailSending = false;
    this.generally_form.reset();
    this.project_form.reset();
  }

  /**
   * Handles errors that occur during the email sending process.
   * @param {any} error The error object.
   */
  private handleError(error: any): void {
    this.emailHasError = true;
    this.emailSending = false;
    console.error('There was an error!', error);
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

  protected readonly faBars = faBars;
  protected readonly faEnvelope = faEnvelope;
}
