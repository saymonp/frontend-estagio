import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { LocalStorageService } from '../services/localStorage.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
 
  constructor( private user: LocalStorageService) { }
 
  intercept(req: HttpRequest<any>, next: HttpHandler) { ///api/v1/
    if (req.url == "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate") {
        req = req.clone({
        url:  req.url,
        setHeaders: {
          Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVlMDdmMjY3Y2Q2ZmQzZDE5ODIyZDMyZWNmNWQyNDg2YmY5OWY4N2U1NDc1ZGZjYWEwOWMwNjc0ZDA1NmNjZWYxMDRiZmViYzI4MWVjY2QzIn0.eyJhdWQiOiIxIiwianRpIjoiZWUwN2YyNjdjZDZmZDNkMTk4MjJkMzJlY2Y1ZDI0ODZiZjk5Zjg3ZTU0NzVkZmNhYTA5YzA2NzRkMDU2Y2NlZjEwNGJmZWJjMjgxZWNjZDMiLCJpYXQiOjE2MjEzNjk3MzksIm5iZiI6MTYyMTM2OTczOSwiZXhwIjoxNjUyOTA1NzM5LCJzdWIiOiJlYTE3ZDFjYS0yOWYzLTQzNjctOGY2Ni0yMThlMTUwMzlmZjkiLCJzY29wZXMiOlsic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY29tcGFuaWVzIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciXX0.qeGhmflpOV74mKPVzm0b95g_d3xDN3xikKCBpAJbgWtuHlUDwtH5E7XkRcS6BBK7uwdIpFYSpdi0LWe3xlA3DyDRMF83k02hfF1ArSxD9cNBE_0W8pTFaBacr4DQdoBvc5_98sGN-OSPn55B1sh5P_6Q1UjRN0ek3INeBNXYUwO3v6E62GvWViotstTCV7NpG8U65Z0t-_dFI3k372-qcNmMnw6FQkr4dyzTAhdfdSB1qcpYcbqQ-oJjvkKZnHcK5aM0g_i4iVwI50IIv_pUz5W0so-cHsJuVaA-h2RQyCNK6r3a1A3h6v4rPJf8dKuALEl8uvXTwXGmmo2C8JFqOw-oNyYdv7LHgQo0Fdlv7nTGNHwM-9It0F_K8WltsCwViEgdYx8WKPbZM1V-dxUtUOFnxUiwbi9d0X-09QMCUDeKFLeV_2AfQ-hxw1Wv0aoBx7ya8AHoGu9fdTU0ZXuw5l69FL8kZbRg6GvIlxZ1qS5C6a_noxmDntNIA7HI8F6TvQyrurIMa9ekBmFiWKIVF5ZbI1se8onJKIRuP-GLsFoXAdLqwovqwi54aqnpjN8PB-vLR_12ZqxBtdYI1fiz4lgiZwh7ZCzYc0W_rBQdUJyywRPZq9ef45LskqcMsXmmxBav2cfd1sDgKvt_aRBo4-QbhoG6gU-h0CBdVlxaURk"
        }
      });
      return next.handle(req);
    }
    if (this.shouldNotIntercept(req) == false) {
      console.log(req.url);
      return next.handle(req);
    } else {
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

  private shouldNotIntercept(req: HttpRequest<any>) {
    return /\/api\/v1\//.test(req.url);
  }
}