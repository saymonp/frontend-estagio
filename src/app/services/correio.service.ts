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

  shippingMelhorPreco(args) {
    //cep, weigth, width, height, length, quantity, price
    const { cep, weight, width, height, length, quantity, price } = args;

    const url = "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate";
    const body = {
      "from": {
        "postal_code": "98801-550",  
        "address": "Rua Abelardo Ferraz de Almeida Campos",
        "number": "1" 
      },
      "to": {
        "postal_code": cep,  
        "address": "Endereço do destinatário",
        "number": "2" 
      },
      "package": {
        weight,
        width,
        height,
        length,
        quantity,
      },
      "options": {
        "insurance_value": price,
        "receipt": false,
        "own_hand": false,
        "collect": false
      },
      "services": "1,2,3,4,9,12,15,16,17,22"
    }

    return this.http.post<any>(url, body, httpHeaders).pipe(
      map((obj) => obj)
    );
  }

}
