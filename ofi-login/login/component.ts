import { Component } from '@angular/core';
import { SetlLoginComponent, LoginGuardService, LoginService } from '@setl/core-login';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})
export class OfiLoginComponent extends SetlLoginComponent {

    public showPassword: boolean = false;
    public showResetTwoFactor: boolean = false;

    logIt(msg) {
        console.log('+++', msg);
    }
}
