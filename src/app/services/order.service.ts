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
export class OrderService {
  constructor(private http: HttpClient) {}
  baseUrl: string = environment.backend.baseURL;

  create(order): Observable<any> {
    const url = `${this.baseUrl}/api/v1/createOrder`;
    return this.http.post<any>(url, order, httpHeaders).pipe(
      map((obj) => obj)
    );
  }

  list(): Observable<any> {
    const url = `${this.baseUrl}/api/v1/listOrders`;
    return this.http.get<any>(url).pipe(
      map((obj) => obj)
    );
  }

  show(id: string): Observable<any> {
    const url = `${this.baseUrl}/api/v1/showOrder/${id}`;
    return this.http.get<any>(url);
  }

  update(status): Observable<any> {
    const url = `${this.baseUrl}/api/v1/updateOrder`;
    return this.http.patch<any>(url, status, httpHeaders).pipe(
      map((obj) => obj)
    );
  }

  delete(id: string): Observable<any> {
    const url = `${this.baseUrl}/api/v1/deleteOrder/${id}`;
    return this.http.delete<any>(url);
  }

  errorHandler(e: Error): Observable<any> {
    alert('Ocorreu um erro!' + e.message);
    return EMPTY;
  }
}