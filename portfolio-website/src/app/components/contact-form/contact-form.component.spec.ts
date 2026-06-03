import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError, Subject, firstValueFrom } from 'rxjs';
import * as fc from 'fast-check';
import { ContactFormComponent } from './contact-form.component';
import { ContactService } from '../../services/contact.service';
import { provideHttpClient } from '@angular/common/http';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let sendMessageSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    sendMessageSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [
        provideHttpClient(),
        { provide: ContactService, useValue: { sendMessage: sendMessageSpy } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should be invalid when empty', () => {
      expect(component.form.invalid).toBe(true);
    });

    it('should be valid with all fields filled correctly', () => {
      component.form.setValue({ name: 'Alice', email: 'alice@example.com', message: 'Hello' });
      expect(component.form.valid).toBe(true);
    });

    it('should mark name invalid when empty', () => {
      component.form.get('name')!.setValue('');
      expect(component.form.get('name')!.invalid).toBe(true);
    });

    it('should mark name invalid when whitespace-only', () => {
      component.form.get('name')!.setValue('   ');
      expect(component.form.get('name')!.invalid).toBe(true);
    });

    it('should mark email invalid when empty', () => {
      component.form.get('email')!.setValue('');
      expect(component.form.get('email')!.invalid).toBe(true);
    });

    it('should mark email invalid when format is wrong', () => {
      component.form.get('email')!.setValue('not-an-email');
      expect(component.form.get('email')!.invalid).toBe(true);
    });

    it('should mark email valid for correct format', () => {
      component.form.get('email')!.setValue('user@domain.com');
      expect(component.form.get('email')!.valid).toBe(true);
    });

    it('should mark message invalid when whitespace-only', () => {
      component.form.get('message')!.setValue('   ');
      expect(component.form.get('message')!.invalid).toBe(true);
    });
  });

  describe('error display', () => {
    it('should not show errors before submit or touch', () => {
      expect(component.isFieldInvalid('name')).toBe(false);
    });

    it('should show error after field is touched', () => {
      component.form.get('name')!.markAsTouched();
      expect(component.isFieldInvalid('name')).toBe(true);
    });

    it('should show errors after submit attempt with invalid form', () => {
      component.onSubmit();
      expect(component.isFieldInvalid('name')).toBe(true);
      expect(component.isFieldInvalid('email')).toBe(true);
      expect(component.isFieldInvalid('message')).toBe(true);
    });
  });

  describe('submit button', () => {
    it('should not be disabled initially', () => {
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(btn.disabled).toBe(false);
    });

    it('should be disabled while submitting', () => {
      const pending$ = new Subject<void>();
      sendMessageSpy.mockReturnValue(pending$.asObservable());
      component.form.setValue({ name: 'Alice', email: 'alice@example.com', message: 'Hello' });
      component.onSubmit();
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(btn.disabled).toBe(true);
    });
  });

  describe('submission', () => {
    beforeEach(() => {
      component.form.setValue({ name: 'Alice', email: 'alice@example.com', message: 'Hello' });
    });

    it('should show success message on successful submission', async () => {
      sendMessageSpy.mockReturnValue(of(undefined));
      component.onSubmit();
      await firstValueFrom(of(undefined)); // flush microtasks
      expect(component.successMessage).toBeTruthy();
      expect(component.errorMessage).toBe('');
    });

    it('should reset form on success', async () => {
      sendMessageSpy.mockReturnValue(of(undefined));
      component.onSubmit();
      await firstValueFrom(of(undefined));
      expect(component.form.get('name')!.value).toBeFalsy();
    });

    it('should show error message on failure', async () => {
      sendMessageSpy.mockReturnValue(throwError(() => new Error('Network error')));
      component.onSubmit();
      await firstValueFrom(of(undefined));
      expect(component.errorMessage).toBe('Something went wrong. Please try again or email me directly.');
      expect(component.successMessage).toBe('');
    });

    it('should re-enable submit button after failure', async () => {
      sendMessageSpy.mockReturnValue(throwError(() => new Error('fail')));
      component.onSubmit();
      await firstValueFrom(of(undefined));
      expect(component.submitting).toBe(false);
    });
  });
});

// Feature: portfolio-website, Property 2: Contact form email validation
// Validates: Requirements 5.4
describe('Property 2: Contact form email validation', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [
        provideHttpClient(),
        { provide: ContactService, useValue: { sendMessage: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should mark email valid for any valid email address', () => {
    fc.assert(
      fc.property(fc.emailAddress(), (email) => {
        component.form.get('email')!.setValue(email);
        return component.form.get('email')!.valid === true;
      }),
      { numRuns: 100 }
    );
  });

  it('should mark email invalid for any string without @', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !s.includes('@') && s.length > 0),
        (nonEmail) => {
          component.form.get('email')!.setValue(nonEmail);
          return component.form.get('email')!.invalid === true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: portfolio-website, Property 1: Contact form rejects whitespace-only fields
// Validates: Requirements 5.3
describe('Property 1: Contact form rejects whitespace-only fields', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [
        provideHttpClient(),
        { provide: ContactService, useValue: { sendMessage: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const whitespaceArb = fc.stringMatching(/^[\s]+$/);

  it('should mark name invalid for any whitespace-only string', () => {
    fc.assert(
      fc.property(whitespaceArb, (ws) => {
        component.form.get('name')!.setValue(ws);
        return component.form.get('name')!.invalid === true;
      }),
      { numRuns: 100 }
    );
  });

  it('should mark message invalid for any whitespace-only string', () => {
    fc.assert(
      fc.property(whitespaceArb, (ws) => {
        component.form.get('message')!.setValue(ws);
        return component.form.get('message')!.invalid === true;
      }),
      { numRuns: 100 }
    );
  });

  it('should mark the whole form invalid when all required fields are whitespace-only', () => {
    fc.assert(
      fc.property(whitespaceArb, whitespaceArb, whitespaceArb, (wsName, wsEmail, wsMessage) => {
        component.form.setValue({ name: wsName, email: wsEmail, message: wsMessage });
        return component.form.invalid === true;
      }),
      { numRuns: 100 }
    );
  });
});
