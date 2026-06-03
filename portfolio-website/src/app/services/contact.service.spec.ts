import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ContactService } from './contact.service';
import { ContactFormData } from '../models/contact-form.model';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  const mockData: ContactFormData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hello there!'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST form data to Formspree endpoint', () => {
    service.sendMessage(mockData).subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('formspree.io'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush({});
  });

  it('should return void on success', async () => {
    const promise = firstValueFrom(service.sendMessage(mockData));
    const req = httpMock.expectOne((r) => r.url.includes('formspree.io'));
    req.flush({});
    const result = await promise;
    expect(result).toBeUndefined();
  });

  it('should propagate error on provider failure', async () => {
    const promise = firstValueFrom(service.sendMessage(mockData));
    const req = httpMock.expectOne((r) => r.url.includes('formspree.io'));
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    await expect(promise).rejects.toMatchObject({ status: 500 });
  });
});
