import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ContactComponent } from './contact.component';
import { ApiClientService } from '@core/services/api/api-client.service';
import { of, Subject, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let apiClientService: jasmine.SpyObj<ApiClientService>;
  let paramMap$: Subject<ReturnType<typeof convertToParamMap>>;

  function createComponent(): void {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function fillValidGenerallyForm(): void {
    component.generally_form.controls['generally_name'].setValue('John Doe');
    component.generally_form.controls['generally_email'].setValue('john@example.com');
    component.generally_form.controls['generally_message'].setValue('Test message');
    component.generally_form.controls['generally_sendCopy'].setValue(false);
    component.generally_form.controls['generally_contactByFax'].setValue(null);
    component.generally_form.controls['generally_yes'].setValue(true);
  }

  function fillValidProjectForm(): void {
    component.project_form.controls['project_company'].setValue('Acme GmbH');
    component.project_form.controls['project_contactName'].setValue('Jane Doe');
    component.project_form.controls['project_phone'].setValue('0123456789');
    component.project_form.controls['project_email'].setValue('jane@acme.de');
    component.project_form.controls['project_address'].setValue('Musterstrasse 1');
    component.project_form.controls['project_title'].setValue('Website Relaunch');
    component.project_form.controls['project_description'].setValue('Neue Corporate Website');
    component.project_form.controls['project_timeline'].setValue('Q3 2026');
    component.project_form.controls['project_sendCopy'].setValue(true);
    component.project_form.controls['project_contactByFax'].setValue(null);
    component.project_form.controls['project_yes'].setValue(true);
  }

  beforeEach(async () => {
    paramMap$ = new Subject();
    const apiClientSpy = jasmine.createSpyObj('ApiClientService', ['post']);
    apiClientSpy.post.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule],
      providers: [
        { provide: ApiClientService, useValue: apiClientSpy },
        { provide: ActivatedRoute, useValue: { paramMap: paramMap$.asObservable() } },
      ],
    }).compileComponents();

    apiClientService = TestBed.inject(ApiClientService) as jasmine.SpyObj<ApiClientService>;
  });

  beforeEach(() => {
    createComponent();
    paramMap$.next(convertToParamMap({}));
  });

  afterEach(() => {
    paramMap$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have valid forms upon initialization', () => {
    expect(component.generally_form).toBeDefined();
    expect(component.generally_form).toBeInstanceOf(FormGroup);
    expect(component.project_form).toBeDefined();
    expect(component.project_form).toBeInstanceOf(FormGroup);
  });

  it('should mark form controls as touched and invalid if generally form is submitted with invalid data', () => {
    component.generally_form.controls['generally_name'].setValue('');
    component.generally_form.controls['generally_email'].setValue('invalid_email');
    component.generally_form.controls['generally_message'].setValue('');
    component.generally_form.controls['generally_yes'].setValue(false);

    component.generally_send();

    expect(component.generally_form.controls['generally_name'].touched).toBeTruthy();
    expect(component.generally_form.controls['generally_name'].invalid).toBeTruthy();
    expect(component.generally_form.controls['generally_email'].touched).toBeTruthy();
    expect(component.generally_form.controls['generally_email'].invalid).toBeTruthy();
    expect(component.generally_form.controls['generally_message'].touched).toBeTruthy();
    expect(component.generally_form.controls['generally_message'].invalid).toBeTruthy();
    expect(apiClientService.post).not.toHaveBeenCalled();
  });

  it('should call the API client service when generally form is submitted with valid data', () => {
    component.generally_form.controls['generally_name'].setValue('John Doe');
    component.generally_form.controls['generally_email'].setValue('john@example.com');
    component.generally_form.controls['generally_message'].setValue('Test message');
    component.generally_form.controls['generally_sendCopy'].setValue(false);
    component.generally_form.controls['generally_contactByFax'].setValue(null);
    component.generally_form.controls['generally_yes'].setValue(true);

    component.generally_send();

    expect(apiClientService.post).toHaveBeenCalledWith('send_email', {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
      sendCopy: false,
    });
  });

  it('should show mapped error message when API returns 500', () => {
    apiClientService.post.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
            error: { message: 'Mail server unavailable' },
          }),
      ),
    );

    fillValidGenerallyForm();
    component.generally_send();

    expect(component.emailHasError()).toBeTrue();
    expect(component.emailSending()).toBeFalse();
    expect(component.emailErrorMessage()).toBe('Mail server unavailable');
  });

  it('should set success state and reset forms on successful send', () => {
    fillValidGenerallyForm();
    component.generally_send();

    expect(component.emailIsSend()).toBeTrue();
    expect(component.emailSending()).toBeFalse();
    expect(component.emailHasError()).toBeFalse();
    expect(component.emailErrorMessage()).toBeNull();
    expect(component.generally_form.pristine).toBeTrue();
    expect(component.project_form.pristine).toBeTrue();
  });

  it('should include optional fax when provided on generally form', () => {
    fillValidGenerallyForm();
    component.generally_form.controls['generally_contactByFax'].setValue('012345');

    component.generally_send();

    expect(apiClientService.post).toHaveBeenCalledWith('send_email', {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
      sendCopy: false,
      contactByFax: '012345',
    });
  });

  it('should select and clear contact form type', () => {
    component.selectContactForm('PROJECT');
    expect(component.contactForm()).toBe('PROJECT');

    component.clearContactForm();
    expect(component.contactForm()).toBeNull();
  });

  it('should set specialized project form from route param', () => {
    paramMap$.next(convertToParamMap({ type: 'project' }));

    expect(component.contactForm()).toBe('PROJECT');
    expect(component.isSpecalized()).toBeTrue();
  });

  it('should set specialized general form from route param', () => {
    paramMap$.next(convertToParamMap({ type: 'general' }));

    expect(component.contactForm()).toBe('GENERALLY');
    expect(component.isSpecalized()).toBeTrue();
  });

  it('should mark project form as touched when invalid on submit', () => {
    component.project_form.controls['project_company'].setValue('');
    component.project_form.controls['project_yes'].setValue(false);

    component.project_send();

    expect(component.project_form.controls['project_company'].touched).toBeTrue();
    expect(apiClientService.post).not.toHaveBeenCalled();
  });

  it('should call API with aggregated project message on valid submit', () => {
    fillValidProjectForm();

    component.project_send();

    expect(apiClientService.post).toHaveBeenCalledWith(
      'send_email',
      jasmine.objectContaining({
        name: 'Jane Doe - Acme GmbH',
        email: 'jane@acme.de',
        sendCopy: true,
        message: jasmine.stringMatching(/Projekttitel: Website Relaunch/),
      }),
    );
  });

  it('should report touched invalid controls via allRequiredFieldsTouchedAndInvalid', () => {
    const control = component.generally_form.controls['generally_name'];
    control.setValue('');
    control.markAsTouched();

    expect(component.allRequiredFieldsTouchedAndInvalid(component.generally_form)).toBeTrue();
  });

  it('should return false when no touched invalid controls exist', () => {
    expect(component.allRequiredFieldsTouchedAndInvalid(component.generally_form)).toBeFalse();
  });

  it('should list invalid controls via findInvalidControls', () => {
    component.generally_form.controls['generally_name'].setValue('');

    const invalid = component.findInvalidControls(component.generally_form);

    expect(invalid.some((entry) => entry.name === 'generally_name')).toBeTrue();
  });

  it('should expose generally form controls via f getter', () => {
    expect(component.f).toBe(component.generally_form.controls);
  });

  it('should encrypt email for display', () => {
    expect(component.encryptedEmail).toBe('info[at]pencil-me.de');
  });
});
