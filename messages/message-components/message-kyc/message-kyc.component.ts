import {Component, Input, OnInit} from '@angular/core';
import {MessageKycConfig} from './message-kyc.model';
import {Router} from '@angular/router';
import {kycMessages} from './message-kyc';

@Component({
    selector: 'setl-message-kyc',
    templateUrl: './message-kyc.component.html',
    styles: [
            `.padding {
            padding: 5px 0;
        }`
    ]
})
export class SetlMessageKycComponent implements OnInit {
    @Input() config: MessageKycConfig;
    messageBody: Object;

    constructor(private router: Router) {
        this.messageBody = null;
    }

    ngOnInit() {
        switch (this.config.type) {
            case 'kycInvestorYes':
                this.messageBody = (this.config.lang === 'fr-Latn') ?
                    this.replaceMessageValue(kycMessages.kycInvestorYes.fr) :
                    this.replaceMessageValue(kycMessages.kycInvestorYes.en);
                break;

            case 'kycInvestorNo':
                this.messageBody = (this.config.lang === 'fr-Latn') ?
                    this.replaceMessageValue(kycMessages.kycInvestorNo.fr) :
                    this.replaceMessageValue(kycMessages.kycInvestorNo.en);
                break;
        }

        console.log('messageBody: ', this.messageBody);
    }

    replaceMessageValue(data) {
        const count = Object.keys(data).length;
        const message = Object.assign({}, data);

        for (let i = 0; i < count; i++) {
            const key = Object.keys(data)[i];
            const value = data[key].replace('{{amFirstName}}', this.config.amFirstName)
                                   .replace('{{amCompanyName}}', this.config.amCompanyName)
                                   .replace('{{investorCompanyName}}', this.config.investorCompanyName)
                                   .replace('{{investorEmail}}', this.config.investorEmail)
                                   .replace('{{investorPhoneNumber}}', this.config.investorPhoneNumber);


            message[key] = value;
        }

        return message;
    }

    handleRedirectButtonClick() {
        this.router.navigate(['kyc-am-documents']);
    }
}
