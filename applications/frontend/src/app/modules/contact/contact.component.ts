import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
  type FormGroup,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { ApiClientService } from '@core/services/api/api-client.service';
import { GibberishRevealDirective } from '@shared/directives/gibberish-reveal.directive';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { mapApiError } from '@app/shared/utils/api-error.util';

type ContactFormType = 'GENERALLY' | 'PROJECT';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    NgTemplateOutlet,
    FaIconComponent,
    ScrollRevealDirective,
    GibberishRevealDirective,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private formBuilder = inject(FormBuilder);
  private apiClient = inject(ApiClientService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  generally_form: FormGroup;
  project_form: FormGroup;

  readonly emailIsSend = signal(false);
  readonly emailSending = signal(false);
  readonly emailHasError = signal(false);
  readonly emailErrorMessage = signal<string | null>(null);
  readonly contactForm = signal<ContactFormType | null>(null);
  readonly isSpecalized = signal(false);

  email: string = 'info@pencil-me.de';
  encryptedEmail: string = this.encryptEmail(this.email);
  textareaPattern: string = '[a-zA-Z0-9\\/!@#$%^&*(),.?":{}|<>\\- \n\r]*';
  textPattern: string = '[a-zA-Z0-9!@#$%^&*(),.?":{}|<>\\- ]*';
  textStrongPattern: string = '[a-zA-Z, ]*';
  minLength: number = 1;
  maxLength: number = 1000;

  constructor() {
    this.generally_form = this.createGenerallyForm();
    this.project_form = this.createProjectForm();

    this.activatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const type = params.get('type') ?? '';
      if (type === 'project') {
        this.contactForm.set('PROJECT');
        this.isSpecalized.set(true);
      }
      if (type === 'general') {
        this.contactForm.set('GENERALLY');
        this.isSpecalized.set(true);
      }
    });
  }

  selectContactForm(type: ContactFormType): void {
    this.contactForm.set(type);
  }

  clearContactForm(): void {
    this.contactForm.set(null);
  }

  /**
   * Initializes the contact form with validation rules.
   */
  private createGenerallyForm(): FormGroup {
    return this.formBuilder.group({
      generally_name: ['', [Validators.required, Validators.pattern(this.textStrongPattern)]],
      generally_email: ['', [Validators.required, Validators.email]],
      generally_message: [
        '',
        [
          Validators.required,
          Validators.pattern(this.textareaPattern),
          Validators.minLength(this.minLength),
          Validators.maxLength(this.maxLength),
        ],
      ],
      generally_sendCopy: [false],
      generally_yes: [false, [Validators.required, Validators.requiredTrue]],
      generally_contactByFax: [null],
    });
  }

  /**
   * Initializes the contact form with validation rules.
   */
  private createProjectForm(): FormGroup {
    return this.formBuilder.group({
      project_company: ['', [Validators.required, Validators.pattern(this.textStrongPattern)]],
      project_contactName: ['', [Validators.required, Validators.pattern(this.textStrongPattern)]],
      project_phone: [''],
      project_email: ['', [Validators.required, Validators.email]],
      project_address: [
        '',
        [
          Validators.required,
          Validators.pattern(this.textareaPattern),
          Validators.minLength(this.minLength),
          Validators.maxLength(this.maxLength),
        ],
      ],
      project_title: ['', [Validators.pattern(this.textPattern)]],
      project_description: [
        '',
        [
          Validators.required,
          Validators.pattern(this.textareaPattern),
          Validators.minLength(this.minLength),
          Validators.maxLength(this.maxLength),
        ],
      ],
      project_timeline: ['', [Validators.required, Validators.pattern(this.textPattern)]],
      project_sendCopy: [false],
      project_yes: [false, [Validators.required, Validators.requiredTrue]],
      project_contactByFax: [null],
    });
  }

  allRequiredFieldsTouchedAndInvalid(form: FormGroup): boolean {
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].errors && controls[name].touched) {
        return true;
      }
    }
    return false;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.generally_form.controls;
  }

  generally_send(): void {
    if (this.isContactSendBlocked(this.generally_form, 'generally_yes')) {
      this.markGenerallyFormAsTouched();
      return;
    }

    this.sendEmail({
      contactByFax: this.readOptionalFax(this.generally_form, 'generally_contactByFax'),
      email: this.readFormValue(this.generally_form, 'generally_email'),
      message: this.readFormValue(this.generally_form, 'generally_message'),
      name: this.readFormValue(this.generally_form, 'generally_name'),
      sendCopy: this.generally_form.get('generally_sendCopy')?.value,
    });
  }

  findInvalidControls(form: FormGroup): { name: string; value: unknown }[] {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push({
          name: name,
          value: controls[name].value as unknown,
        });
      }
    }
    return invalid;
  }

  private markGenerallyFormAsTouched(): void {
    this.generally_form.markAllAsTouched();
  }

  project_send(): void {
    if (this.isContactSendBlocked(this.project_form, 'project_yes')) {
      this.markProjectFormAsTouched();
      return;
    }

    this.sendEmail({
      contactByFax: this.readOptionalFax(this.project_form, 'project_contactByFax'),
      email: this.readFormValue(this.project_form, 'project_email'),
      message: this.buildProjectMessage(),
      name: `${this.readFormValue(this.project_form, 'project_contactName')} - ${this.readFormValue(this.project_form, 'project_company')}`,
      sendCopy: this.project_form.get('project_sendCopy')?.value,
    });
  }

  private isContactSendBlocked(form: FormGroup, consentKey: string): boolean {
    return form.invalid || form.get(consentKey)?.value === false;
  }

  private readFormValue(form: FormGroup, key: string): string {
    return String(form.get(key)?.value ?? '');
  }

  private readOptionalFax(form: FormGroup, key: string): string | undefined {
    const value: unknown = form.get(key)?.value;
    if (typeof value !== 'string' || !value) {
      return undefined;
    }
    return value;
  }

  private buildProjectMessage(): string {
    const form = this.project_form;
    return [
      `Firmenname: ${this.readFormValue(form, 'project_company')}`,
      `Ansprechpartner: ${this.readFormValue(form, 'project_contactName')}`,
      `Telefonnummer: ${this.readFormValue(form, 'project_phone')}`,
      `E-Mail: ${this.readFormValue(form, 'project_email')}`,
      `Anschrift: ${this.readFormValue(form, 'project_address')}`,
      '-------------------------------------------------------',
      `Projekttitel: ${this.readFormValue(form, 'project_title')}`,
      `Projektbeschreibung: ${this.readFormValue(form, 'project_description')}`,
      `Geplanter Zeitraum: ${this.readFormValue(form, 'project_timeline')}`,
    ].join('\n');
  }

  private markProjectFormAsTouched(): void {
    this.project_form.markAllAsTouched();
  }

  private sendEmail(formData: Record<string, unknown>): void {
    const honeypot = formData['contactByFax'];
    if (typeof honeypot === 'string' && honeypot.length > 0) {
      this.emailSending.set(false);
      return;
    }

    this.emailSending.set(true);
    this.emailHasError.set(false);
    this.emailErrorMessage.set(null);
    this.apiClient.post('send_email', this.removeUndefinedKeys(formData)).subscribe({
      next: (data) => this.handleSuccess(data),
      error: (error) => this.handleError(error),
    });
  }

  private removeUndefinedKeys<T extends object>(object: T): T {
    Object.keys(object).forEach((key) => {
      if (object[key as keyof T] === undefined) {
        delete object[key as keyof T];
      }
    });
    return object;
  }

  private handleSuccess(_data: unknown): void {
    this.emailIsSend.set(true);
    this.emailSending.set(false);
    this.emailHasError.set(false);
    this.emailErrorMessage.set(null);
    this.generally_form.reset();
    this.project_form.reset();
  }

  private handleError(error: unknown): void {
    this.emailHasError.set(true);
    this.emailSending.set(false);
    this.emailErrorMessage.set(mapApiError(error));
  }

  private encryptEmail(email: string): string {
    return email.replace('@', '[at]');
  }

  protected readonly faBars = faBars;
  protected readonly faEnvelope = faEnvelope;
}
