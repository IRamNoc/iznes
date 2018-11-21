import { Component } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { SetlLoginComponent, LoginGuardService, LoginService } from '@setl/core-login';

@Component({
    styleUrls: ['./component.scss'],
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
export class OfiLoginComponent extends SetlLoginComponent {

    public showLogin: boolean = false;
    public showPassword: boolean = false;
    public showResetTwoFactor: boolean = false;
    public twoFactorResetVerified: boolean = false;

    ngAfterViewInit() {
        setTimeout(
            () => {
                this.showLogin = true;
            },
            200,
        );
    }

}
