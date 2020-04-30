import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '../okta-auth.service';

@Component({
    selector: 'app-login-ssoengie',
    templateUrl: './login-ssoengie.component.html',
})

export class LoginSSOEngieComponent implements OnInit {
    constructor(private oktaAuth: OktaAuthService) { }

    async ngOnInit() {
        this.oktaAuth.initiateLogin()
    }
}
