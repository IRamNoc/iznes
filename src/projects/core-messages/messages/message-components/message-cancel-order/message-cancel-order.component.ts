import { Component, Input, OnInit } from '@angular/core';
import { MessageCancelOrderConfig } from './message-cancel-order.model';
import { Router } from '@angular/router';
import { orderMessages } from './message-cancel-order';
import { LogService } from '@setl/utils';

@Component({
    selector: 'setl-message-cancel-order',
    templateUrl: './message-cancel-order.component.html',
    styles: [`
        .padding {
            padding: 5px 0;
        }
    `],
})
export class SetlMessageAmCancelOrderComponent implements OnInit {
    @Input() config: MessageCancelOrderConfig;
    messageBody: Object;

    constructor(private router: Router,
                private logService: LogService) {
        this.messageBody = null;
    }

    ngOnInit() {
        this.messageBody = (this.config.lang === 'fr-Latn') ?
            this.replaceMessageValue(orderMessages.amCancelOrder.fr) :
            this.replaceMessageValue(orderMessages.amCancelOrder.en);

        this.logService.log('messageBody: ', this.messageBody);
    }

    replaceMessageValue(data) {
        const count = Object.keys(data).length;
        const message = Object.assign({}, data);

        for (let i = 0; i < count; i++) {
            const key = Object.keys(data)[i];
            const value = data[key].replace('{{orderType}}', this.config.orderType)
                .replace('{{orderRef}}', this.config.orderRef)
                .replace('{{orderDate}}', this.config.orderDate)
                .replace('{{amCompanyName}}', this.config.amCompanyName)
                .replace('{{cancelMessage}}', `"${this.config.cancelMessage}"`);

            message[key] = value;
        }

        return message;
    }
}
