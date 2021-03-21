import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/core/authentication/authentication.service';

declare var chrome: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
  ) {
    this.createForm()
  }

  ngOnInit(): void {
  }

  loginSubmit() {
    this.isLoading = true;
    this.authenticationService.login(this.loginForm.value).subscribe((credentials: any) => {
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      console.log('error: ', error);
    });
  }

  async checkForPermission() {
    await this.permissionCheck()
    this.loginSubmit();
  }

  permissionCheck() {
    return new Promise(resolve => {
      chrome.permissions.request({
        permissions: ['tabs'],
        origins: ['https://answers.yahoo.com/', 'http://localhost:4200/seed-network']
      }, (granted) => {
        resolve(granted)
      });
    })
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }

}
