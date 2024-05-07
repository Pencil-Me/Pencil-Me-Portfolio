import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ContactComponent } from './contact.component';
import { ApiClientService } from '@core/services/api/api-client.service';
import { of } from 'rxjs';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let apiClientService: jasmine.SpyObj<ApiClientService>;

  beforeEach(async () => {
    const apiClientSpy = jasmine.createSpyObj('ApiClientService', ['put']);
    apiClientSpy.put.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule],
      providers: [{ provide: ApiClientService, useValue: apiClientSpy }],
    }).compileComponents();

    apiClientService = TestBed.inject(ApiClientService) as jasmine.SpyObj<ApiClientService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form upon initialization', () => {
    expect(component.form).toBeDefined();
    expect(component.form).toBeInstanceOf(FormGroup);
  });

  it('should mark form controls as touched and invalid if form is submitted with invalid data', () => {
    // Set invalid values to trigger form validation errors
    component.form.controls['name'].setValue('');
    component.form.controls['email'].setValue('invalid_email');
    component.form.controls['message'].setValue('');

    // Trigger form submission
    component.send();

    // Check if form controls are marked as touched and invalid
    expect(component.form.controls['name'].touched).toBeTruthy();
    expect(component.form.controls['name'].invalid).toBeTruthy();
    expect(component.form.controls['email'].touched).toBeTruthy();
    expect(component.form.controls['email'].invalid).toBeTruthy();
    expect(component.form.controls['message'].touched).toBeTruthy();
    expect(component.form.controls['message'].invalid).toBeTruthy();

    // Ensure the API client service method was not called
    expect(apiClientService.put).not.toHaveBeenCalled();
  });

  it('should call the API client service method when form is submitted with valid data', () => {
    // Set valid values to the form
    component.form.controls['name'].setValue('John Doe');
    component.form.controls['email'].setValue('john@example.com');
    component.form.controls['message'].setValue('Test message');
    component.form.controls['sendCopy'].setValue(false);
    component.form.controls['contactByFax'].setValue(null);

    // Trigger form submission
    component.send();

    // Check if the API client service method was called with the correct arguments
    expect(apiClientService.put).toHaveBeenCalledWith('send_email', {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
      sendCopy: false,
      contactByFax: null,
    });
  });
});
