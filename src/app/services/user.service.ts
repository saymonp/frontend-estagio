import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

const httpHeaders = {
  headers: new HttpHeaders({ 'Content-type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  baseUrl: string = environment.backend.baseURL;

  listUsers(): Observable<any> {
      return this.http.get<any>(
        `${this.baseUrl}/api/v1/listUsers`
      ).pipe(catchError((e) => this.errorHandler(e)));
    }

  login(userData): Observable<any> {
    const url = `${this.baseUrl}/api/v1/login`;
    return this.http.post<any>(url, userData, httpHeaders).pipe(
      map((obj) => obj)
    );
  }

  deleteUser(userData): Observable<any> {
    const url = `${this.baseUrl}/api/v1/deleteUser`;
    return this.http.delete<any>(url, userData).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  errorHandler(e: Error): Observable<any> {
    alert('Ocorreu um erro!' + e.message);
    return EMPTY;
  }
}