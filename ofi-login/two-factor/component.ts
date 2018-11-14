import { Component, Input } from '@angular/core';
import { AuthenticateComponent, LoginGuardService, LoginService } from '@setl/core-login';

@Component({
    selector: 'ofi-two-factor',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})
export class OfiTwoFactorComponent extends AuthenticateComponent {

    @Input() showReset: boolean = false;

}
