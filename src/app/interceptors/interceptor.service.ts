import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { LocalStorageService } from '../services/localStorage.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
 
  constructor( private user: LocalStorageService) { }
 
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.user.get("token");
    req = req.clone({
      url:  req.url,
      setHeaders: {
        Authorization: `bearer ${token}`
      }
    });
    return next.handle(req);
  }
}