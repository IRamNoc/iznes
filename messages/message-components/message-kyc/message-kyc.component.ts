import {Component, Input} from '@angular/core';
import {MessageKycConfig} from './message-kyc.model';

@Component({
    selector: 'setl-message-kyc',
    templateUrl: './message-kyc.component.html',
    styleUrls: ['./message-kyc.component.css'],
})
export class SetlMessageKycComponent {
    @Input() config: MessageKycConfig;

    constructor() {
        console.log('config: ', this.config);
    }
}
