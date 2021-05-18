import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { catchError, map } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService { 
  baseUrl: string = environment.backend.baseURL;

  constructor(private http: HttpClient) { }

  uploadFile(file: any): any {
    return this.http.post(`${this.baseUrl}/api/v1/uploadFile`, JSON.stringify(file), {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
      responseType: 'text',
      observe: 'response',
    });
  }

  errorHandler(e: Error): Observable<any> {
    alert('Ocorreu um erro!' + e.message);
    return EMPTY;
  }

  deleteFile(key: String): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        key,
      },
    };

    const url = `${this.baseUrl}/api/v1/deleteFile`;
    return this.http.delete<any>(url, options).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    ); 
  }
  

  getPresignedUrl(path: string, fileName: string): Observable<any> {
    const name = fileName.replace(/[^a-zA-Z-0-9-(-) .]/g, "")
    const url = `${this.baseUrl}/api/v1/uploadPresignedUrl/${encodeURIComponent(path)}/${name}`;
    return this.http.get<any>(url);
  }

  uploadFilePresignedUrl(presignedUrl, file) {
    const url = presignedUrl.url;

    return this.http.post(url, file, {
      responseType: 'text',
      observe: 'response',
    });
  }
  
}
