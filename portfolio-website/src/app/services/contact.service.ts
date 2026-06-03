import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ContactFormData } from '../models/contact-form.model';

// Replace YOUR_FORM_ID with your actual Formspree form ID
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  sendMessage(data: ContactFormData): Observable<void> {
    return this.http.post(FORMSPREE_ENDPOINT, data).pipe(
      map(() => void 0),
      catchError((error) => throwError(() => error))
    );
  }
}
