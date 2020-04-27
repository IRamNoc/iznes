import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-ssoengie',
  templateUrl: './login-ssoengie.component.html',
})

export class LoginSSOEngieComponent implements OnInit {
  isAuthenticated: boolean;

  constructor(public oktaAuth: OktaAuthService) {
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (!this.isAuthenticated) return this.oktaAuth.loginRedirect('/sso-engie');
    console.log("Already Authenticated")
    let accessToken = await this.oktaAuth.getAccessToken();
  }

  async showInfo() {
    const userClaims = await this.oktaAuth.getUser();
    console.log(userClaims)
  }
}
