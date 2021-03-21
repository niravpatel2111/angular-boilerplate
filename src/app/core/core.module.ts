import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { ErrorHandlerInterceptor } from '@app/core/http/error-handler.interceptor';
import { HttpService } from '@app/core/http/http.service';
import { UtilService } from '@app/core/service/util.service';

import { AuthenticationGuard } from './authentication/authentication.guard';
import { NotAuthenticationGuard } from './authentication/notAuthentication.guard';
import { ApiPrefixInterceptor } from './http/api-prefix.interceptor';
import { RouteReusableStrategy } from './route-reusable-strategy';
import { ErrorMessageService } from './service/error-message.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule
    ],
    declarations: [],
    providers: [
        AuthenticationGuard,
        AuthenticationService,
        ErrorHandlerInterceptor,
        ApiPrefixInterceptor,
        UtilService,
        ErrorMessageService,
        NotAuthenticationGuard,

        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiPrefixInterceptor,
            multi: true
        },
        {
            provide: HttpClient,
            useClass: HttpService
        },
        {
            provide: RouteReuseStrategy,
            useClass: RouteReusableStrategy
        }
    ]
})
export class CoreModule { }
