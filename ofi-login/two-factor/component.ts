import { Component, Input } from '@angular/core';
import { AuthenticateComponent, LoginGuardService, LoginService } from '@setl/core-login';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'ofi-two-factor',
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
export class OfiTwoFactorComponent extends AuthenticateComponent {

    showModal: boolean = true;
    emailSent = false;
    showResetInstruction: boolean = false;

    @Input() showReset: boolean = false;

}
