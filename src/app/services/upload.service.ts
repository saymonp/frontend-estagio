import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { catchError } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService { 
  url: string = environment.backend.baseURL;

  constructor(private http: HttpClient) { }

  uploadFile(file: any): any {
    return this.http.post(`${this.url}/api/v1/uploadFile`, JSON.stringify(file), {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
      responseType: 'text',
      observe: 'response',
    });
  }

  errorHandler(e: Error): Observable<any> {
    alert('Ocorreu um erro!' + e.message);
    return EMPTY;
  }

  deleteFile(data: any) {
    return this.http.post(`${this.url}/api/v1/deleteFile`, JSON.stringify(data), {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
      responseType: 'text',
      observe: 'response',
    });
  }

}
