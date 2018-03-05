import {Component, Input} from '@angular/core';
import {MessageKycConfig} from './message-kyc.model';
import {Router} from '@angular/router';

@Component({
    selector: 'setl-message-kyc',
    templateUrl: './message-kyc.component.html',
    styles: [
            `.padding {
            padding: 5px 0;
        }`
    ]
})
export class SetlMessageKycComponent {
    @Input() config: MessageKycConfig;

    constructor(private router: Router) {

    }

    handleRedirectButtonClick() {
        this.router.navigate(['kyc-am-documents']);
    }
}
