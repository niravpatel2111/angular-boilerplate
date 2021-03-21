import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

/**
 * Prefixes all requests with `environment.serverUrl`.
 */
@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request && request.body && request.body.download === 'YES') {
      request = request.clone({
        url: environment.serverBaseUrl + request.url
      });
    } else {
      if (request.url.charAt(0) === '/') {
        request = request.clone({
          url: environment.serverUrl + request.url
        });
      }
    }
    if (this.authenticationService.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: this.authenticationService.accessToken
        }
      });
    }
    return next.handle(request);
  }
}
