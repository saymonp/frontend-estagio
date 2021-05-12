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

  deleteFile(data: any) {
    return this.http.post(`${this.baseUrl}/api/v1/deleteFile`, JSON.stringify(data), {
      headers: new HttpHeaders({ 'Content-type': 'application/json' }),
      responseType: 'text',
      observe: 'response',
    });
  }

  getPresignedUrl(path: string, fileName: string): Observable<any> {
    const url = `${this.baseUrl}/api/v1/uploadPresignedUrl/${encodeURIComponent(path)}/${fileName}`;
    return this.http.get<any>(url);
  }

  uploadFilePresignedUrl(presignedUrl, file) {
    const httpHeaders = {
      headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
    };

    const url = presignedUrl.url;
    //const fields = presignedUrl.fields;
    //fields.files = file.get("files");
    //console.log(fields);
    //console.log(file.get("files"))

    return this.http.post<any>(url, file).pipe(
      map((obj) => obj)
    );
  }
  


}
