import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { Common, SagaHelper, LogService } from '@setl/utils';
import { MemberSocketService, WalletNodeSocketService } from '@setl/websocket-service';

import { MessagesService } from '../../../messages.service';
import { MessageConnection } from './message-connection.model';

@Injectable()
export class SetlMessageConnectionService {
    constructor(private ngRedux: NgRedux<any>,
                private memberSocketService: MemberSocketService,
                private walletNodeSocketService: WalletNodeSocketService,
                private messageService: MessagesService,
                private logService: LogService,
                private alertsService: AlertsService) {
    }

    doAction(action: MessageConnection, walletId: number, mailId: number) {
        let messageBody = {
            RequestName: action.payload.topic,
            token: this.memberSocketService.token,
        };

        messageBody = Object.assign({}, messageBody, action.payload);

        const asyncTaskPipe = Common.createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                this.onActionSuccess(data, walletId, mailId);
            },
            (data) => {
                this.onActionError(data);
            },
        ));
    }

    private onActionSuccess(data, walletId: number, mailId: number): void {
        this.messageService.markMessageAsActed(walletId, mailId, '').then((res) => {
            const message = (data[1].Request === 'deleteConnection') ? 'rejected' : 'accepted';
            this.alertsService.create('success', `The connection request has been ${message}`);
        }).catch((e) => {
            this.logService.log('mark mail as acted error', e);
        });
    }

    private onActionError(data): void {
        this.alertsService.create('error', 'The connection request has been rejected');
    }
}
