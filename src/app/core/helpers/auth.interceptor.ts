import { HTTP_INTERCEPTORS, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";

import { TokenStorageService } from "../../core/services/token-storage.service";
import { Observable } from "rxjs";

// const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end
const TOKEN_HEADER_KEY = "Authorization"; // for Node.js Express back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    // const token = this.token.getToken();
    const token = "Basic MTExNzk4ODU6NjAtZGF5ZnJlZXRyaWFs";
    if (token != null) {
      // for Spring Boot back-end
      // authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
      authReq = req.clone({
        setHeaders: {
          "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
          Authorization: "Basic MTExNzk4ODU6NjAtZGF5ZnJlZXRyaWFs",
          Referer:
            "http://platx2024-001-site1.ctempurl.com/swagger/index.html",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          accept: "*/*",
        }
      });
    }

    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
