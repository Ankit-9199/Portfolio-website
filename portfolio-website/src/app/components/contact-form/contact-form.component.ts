import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  return value.trim().length > 0 ? null : { whitespace: true };
}

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  submitting = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  form = this.fb.group({
    name: ['', [Validators.required, noWhitespaceValidator]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, noWhitespaceValidator]]
  });

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    const { name, email, message } = this.form.value;

    this.contactService.sendMessage({
      name: name!.trim(),
      email: email!.trim(),
      message: message!.trim()
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Your message has been sent! I\'ll get back to you soon.';
        this.form.reset();
        this.submitted = false;
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'Something went wrong. Please try again or email me directly.';
      }
    });
  }
}
