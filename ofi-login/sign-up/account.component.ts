import { Component } from '@angular/core';
import { SignupComponent, LoginGuardService, LoginService } from '@setl/core-login';
import { AccountSignUpComponent } from '@setl/core-account-admin';

@Component({
    selector: 'ofi-account-sign-up',
    template: '<ofi-sign-up [configuration]="configuration" (signupDataEmit)="setSignupData($event)"></ofi-sign-up>',
})
export class OfiAccountSignUpComponent extends AccountSignUpComponent {

}
