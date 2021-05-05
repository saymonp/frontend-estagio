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
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: userData.id,
        email: userData.email,
      },
    };

    const url = `${this.baseUrl}/api/v1/deleteUser`;
    return this.http.delete<any>(url, options).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  updateUser(permissions): Observable<any> {
    const url = `${this.baseUrl}/api/v1/updatePermissions`;
    return this.http.post<any>(url, permissions, httpHeaders).pipe(
      map((obj) => obj)
    );
  }

  registerUser(user): Observable<any> {
    const url = `${this.baseUrl}/api/v1/register`;
    return this.http.post<any>(url, user, httpHeaders).pipe(
      map((obj) => obj)
    );
  }

  errorHandler(e: Error): Observable<any> {
    alert('Ocorreu um erro!' + e.message);
    return EMPTY;
  }
}