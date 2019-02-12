import { Component, Input, OnInit } from '@angular/core';
import { MessageMTConfig } from './message-mt.model';
import { Router } from '@angular/router';
import { mtMessages } from './message-mt';
import { LogService } from '@setl/utils';
import { isNil } from 'lodash';
import { FileDownloader } from '@setl/utils';

@Component({
    selector: 'setl-message-mt',
    templateUrl: './message-mt.component.html',
    styles: [
        `.padding {
            padding: 5px 0;
        }`,
    ],
})
export class SetlMessageKycComponent implements OnInit {
    @Input() config: MessageMTConfig;
    messageBody: Object;

    constructor(
        private router: Router,
        private logService: LogService,
        private fileDownloader: FileDownloader,
    ) {
        this.messageBody = null;
    }

    ngOnInit() {
        switch (this.config.type) {
            case '900-Admin':
                this.messageBody = this.isFrench() ?
                    this.replaceMessageValue(mtMessages['900-Admin'].fr) :
                    this.replaceMessageValue(mtMessages['900-Admin'].en);
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
            .replace('{{adminName}}', this.config.adminName)
            .replace('{{link}}', this.config.link);

            message[key] = value;
        }

        return message;
    }

    downloadTxtFile(data) {
        const body = {
            method: 'getIznMTFile',
            mtType: data.mtType,
            token: this.socketToken,
            orderId: data.orderID,
            userId: this.userId,
        };

        if (data.mtType == 'MT101') body['messageType'] = data.messageType;
        if (data.mtType == 'MT502') {
            body['MT502ID'] = data.MT502ID;
            body['type'] = data.orderType;
        }

        this.fileDownloader.downLoaderFile(body);
    }

    handleRedirectButtonClick(route) {
        // TODO: 
        // this.router.navigate(['on-boarding', 'management']);
    }
}
