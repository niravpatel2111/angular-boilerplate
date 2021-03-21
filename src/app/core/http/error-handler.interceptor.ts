import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorMessageService } from '@app/core/service/error-message.service';
import { UtilService } from '@app/core/service/util.service';
import { environment } from '@env/environment';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CONSTANT } from './../constants';


/**
 * Adds a default error handler to all requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private utilService: UtilService,
    private errorMessageService: ErrorMessageService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.utilService.clearMissedError();
    return next
      .handle(request)
      .pipe(catchError(error => this.errorHandler(error, request)));
  }

  // Customize the default error handler here if needed
  private errorHandler(
    response: HttpResponse<any>,
    request: HttpRequest<any>
  ): Observable<HttpEvent<any>> {

    if (response.status === 401) {
      const savedCredentials = localStorage.getItem(CONSTANT.credentialsKey);
      if (savedCredentials) {
        const local = _.cloneDeep(CONSTANT);
        for (const key in local) {
          if (local.hasOwnProperty(key)) {
            const element = local[key];
            localStorage.clearItem(element);
          }
        }
        window.location.reload();
      }
    }

    if (response.status === 400 || response.status === 404 || response.status === 401) {
      const errorResponse: any = response;
      if (errorResponse.error) {
        if (errorResponse.error.validation && errorResponse.error.validation.errors) {
          this.errorMessageService.clear();
          Object.keys(errorResponse.error.validation.errors).forEach((key: string) => {
            this.errorMessageService.set(
              errorResponse.error.validation.errors[key],
              key,
              response.url
            );
          });
        } else {
          this.utilService.clearMissedError();
          this.utilService.setMissedError(errorResponse.error.message);
        }
      }
    } else if (response.status === 500) {
      const errorResponse: any = response;
      this.utilService.clearMissedError();
      this.utilService.setMissedError(errorResponse.error.message);
    }

    if (!environment.production) {
      // Do something with the error
      console.error('Request error', response);
    }
    throw response;
  }
}
