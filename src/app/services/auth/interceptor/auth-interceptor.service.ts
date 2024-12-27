import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthenticationService } from '../authentification-service/authentication.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const WHITE_LIST_URL = ['/login', '/register'];
    const isExcluded = WHITE_LIST_URL.some(url => request.url.includes(url));

    if (!isExcluded) {
      const authToken = this.authService.getToken();
      if (authToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      tap(event => {
        const startTime = Date.now();
        if (event instanceof HttpResponse) {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          console.log(`Request to ${request.url} took ${responseTime}ms`);
        }
      })
    );
  }
}
