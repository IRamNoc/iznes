import { Component } from '@angular/core';
import { SignupComponent, LoginGuardService, LoginService } from '@setl/core-login';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'ofi-sign-up',
    styleUrls: ['../login/component.scss'],
    templateUrl: './component.html',
    animations: [
        trigger('fadeInOnLoad', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(1600, style({ opacity: 1 })),
            ]),
            state('*', style({ opacity: 1 })),
        ]),
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(500, style({ opacity: 1 })),
            ]),
            state('*', style({ opacity: 1 })),
        ]),
    ],
})
export class OfiCoreSignUpComponent extends SignupComponent {

    public showLogin: boolean = false;
    public showResetTwoFactor: boolean = false;

    ngAfterViewInit() {
        setTimeout(
            () => {
                this.showLogin = true;
            },
            200,
        );
    }

}
