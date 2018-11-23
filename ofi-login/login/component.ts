import { Component } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { SetlLoginComponent, LoginGuardService, LoginService } from '@setl/core-login';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    animations: [
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

    public showPassword: boolean = false;
    public showResetTwoFactor: boolean = false;
    public twoFactorResetVerified: boolean = false;
    public showModal = false;
    public resetPassword: boolean = false;
    public showTwoFactorModal = false;
    public resetTwoFactorToken = '';
    public emailSent = false;
    public isTokenExpired = false;
    public changePassword = false;
    public qrCode: string = '';
    public language: string;
    public langLabels = {
        'fr-Latn': 'Francais',
        'en-Latn': 'English',
    };

    getLabel(lang: string): string {
        return this.langLabels[lang];
    }

}
