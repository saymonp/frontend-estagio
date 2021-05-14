import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


const httpHeaders = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

@Injectable({
  providedIn: 'root'
})
export class CorreioService {

  baseUrl: string = environment.correio.baseURL;

  constructor(private http: HttpClient) { }

  locationAndPrice(args) {
    const url = `${this.baseUrl}/api/v1/correio`;
    return this.http.post<any>(url, args, httpHeaders).pipe(
      map((obj) => obj)
    );
  }

  location(cep) {
    const url = `${this.baseUrl}/api/v1/location/${cep}`;
    return this.http.get<any>(url).pipe(
      map((obj) => obj)
    );
  }

  shippingPrice(args) {
    const url = `${this.baseUrl}/api/v1/shipping`;
    return this.http.post<any>(url, args);
  }

  errorHandler(e: Error): Observable<any> {
    alert('Ocorreu um erro!' + e.message);
    return EMPTY;
  }

}
