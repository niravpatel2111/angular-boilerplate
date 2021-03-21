import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './authentication/login/login.component';
import { AuthenticationGuard } from './core/authentication/authentication.guard';
import { NotAuthenticationGuard } from './core/authentication/notAuthentication.guard';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [NotAuthenticationGuard],
    component: LoginComponent,
  },
  {
    path: 'home',
    canActivate: [AuthenticationGuard],
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
