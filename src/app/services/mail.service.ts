import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class MailService {

  baseUrl: string = environment.backend.baseURL;

  constructor(private http: HttpClient) { }

sendEmail(email) {
    return this.http.post(`${this.baseUrl}/api/v1/sendContactEmail`, JSON.stringify(email), {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
      responseType: 'text',
      observe: 'response',
    });
  }

  errorHandler(e: Error): Observable<any> {
    alert('Ocorreu um erro!' + e.message);
    return EMPTY;
  }

}
