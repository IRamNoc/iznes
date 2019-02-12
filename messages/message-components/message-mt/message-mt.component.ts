import { Component, Input, OnInit } from '@angular/core';
import { MessageMTConfig } from './message-mt.model';
import { Router } from '@angular/router';
import { LogService } from '@setl/utils';
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
export class SetlMessageMTComponent implements OnInit {
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
        console.log('+++ config: ', this.config);
    }

    downloadTxtFile(data) {
        console.log('+++ downloadTxtFile: data');
        /* const body = {
            method: 'getIznMTFile',
            mtType: data.mtType,
            // token: this.socketToken,
            orderId: data.orderID,
            // userId: this.userId,
        };

        if (data.mtType == 'MT101') body['messageType'] = data.messageType;
        if (data.mtType == 'MT502') {
            body['MT502ID'] = data.MT502ID;
            body['type'] = data.orderType;
        }

        this.fileDownloader.downLoaderFile(body); */
    }

    handleRedirectButtonClick(route) {
        // TODO:
        // this.router.navigate(['on-boarding', 'management']);
    }
}
