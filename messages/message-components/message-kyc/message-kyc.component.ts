import { Component, Input, OnInit } from '@angular/core';
import { MessageKycConfig } from './message-kyc.model';
import { Router } from '@angular/router';
import { kycMessages } from './message-kyc';
import { LogService } from '@setl/utils';

@Component({
    selector: 'setl-message-kyc',
    templateUrl: './message-kyc.component.html',
    styles: [
            `.padding {
            padding: 5px 0;
        }`,
    ],
})
export class SetlMessageKycComponent implements OnInit {
    @Input() config: MessageKycConfig;
    messageBody: Object;

    constructor(private router: Router,
                private logService: LogService) {
        this.messageBody = null;
    }

    ngOnInit() {
        switch (this.config.type) {
        case 'kycInvestorYes':
            this.messageBody = this.isFrench() ?
                this.replaceMessageValue(kycMessages.kycInvestorYes.fr) :
                this.replaceMessageValue(kycMessages.kycInvestorYes.en);
            break;

        case 'kycInvestorNo':
            this.messageBody = this.isFrench() ?
                this.replaceMessageValue(kycMessages.kycInvestorNo.fr) :
                this.replaceMessageValue(kycMessages.kycInvestorNo.en);
            break;
        case 'kycUserFinished':
            this.messageBody = this.isFrench() ?
                this.replaceMessageValue(kycMessages.kycUserFinished.fr) :
                this.replaceMessageValue(kycMessages.kycUserFinished.en);
            break;
        case 'kycInvestorCompletion':
            this.messageBody = this.isFrench() ?
                this.replaceMessageValue(kycMessages.kycInvestorCompletion.fr) :
                this.replaceMessageValue(kycMessages.kycInvestorCompletion.en);
            break;
        case 'kycContinuedFromRequest':
            this.messageBody = this.isFrench() ?
                this.replaceMessageValue(kycMessages.kycContinuedFromRequest.fr) :
                this.replaceMessageValue(kycMessages.kycContinuedFromRequest.en);
            break;
        case 'kycContinuedFromAskMoreInfo':
            this.messageBody = this.isFrench() ?
                this.replaceMessageValue(kycMessages.kycContinuedFromAskMoreInfo.fr) :
                this.replaceMessageValue(kycMessages.kycContinuedFromAskMoreInfo.en);
            break;
        }

        this.logService.log('messageBody: ', this.messageBody);
    }

    isFrench() {
        const lang = this.config.lang;
        if (!lang) {
            return false;
        }

        return lang.toLowerCase() === 'fr-latn';
    }

    replaceMessageValue(data) {
        const count = Object.keys(data).length;
        const message = Object.assign({}, data);

        for (let i = 0; i < count; i += 1) {
            const key = Object.keys(data)[i];
            const value = data[key].replace('{{amFirstName}}', this.config.amFirstName)
            .replace('{{amCompanyName}}', this.config.amCompanyName)
            .replace('{{investorCompanyName}}', this.config.investorCompanyName)
            .replace('{{investorFirstName}}', this.config.investorFirstName)
            .replace('{{investorEmail}}', this.config.investorEmail)
            .replace('{{investorPhoneNumber}}', this.config.investorPhoneNumber);

            message[key] = value;
        }

        return message;
    }

    handleRedirectButtonClick() {
        this.router.navigate(['on-boarding', 'management']);
    }
}
