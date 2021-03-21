import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authenticationService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }, replaceUrl: true, });
    return false;
  }
}
