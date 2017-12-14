import {Injectable} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {Common, SagaHelper} from '@setl/utils';
import {WalletNodeSocketService} from '@setl/websocket-service';

import {MessagesService} from '../../../messages.service';
import {MessageAction, MessageActionsConfig} from './message-form-action.model';

@Injectable()
export class SetlMessageFormActionService {

    constructor(private ngRedux: NgRedux<any>,
        private walletNodeSocketService: WalletNodeSocketService,
        private alertsService: AlertsService,
        private messagesService: MessagesService) {}

    doAction(action: MessageAction, walletId: number, mailId: number) {
        const request = Common.createWalletNodeSagaRequest(this.walletNodeSocketService, action.messageType, action.payload);
        
        this.ngRedux.dispatch(SagaHelper.runAsync(
            action.successType,
            action.failureType,
            request,
            {},
            (data) => {
                console.log('message action success:', data);

                this.onActionSuccess(data, walletId, mailId);
            },
            (data) => {
                console.log('message action failed:', data);

                this.onActionError(data);
            }
        ));
    }

    private onActionSuccess(data, walletId: number, mailId: number): void {
        const hash = ((data[1]) && data[1].data.hash) ? data[1].data.hash : null;

        const markAsReadRequest = this.messagesService.markMessageAsActed(walletId, mailId, hash).then((res) => {
            const message = (hash) ? `<table class="table grid">
                <tbody>
                    <tr>
                        <td class="left"><b>Tx hash:</b></td>
                        <td>${data[1].data.hash.substring(0, 10)}...</td>
                    </tr>
                </tbody>
            </table>` : '';

            this.alertsService.create('success', message);
        }).catch((e) => {
            console.log("mark mail as acted error", e);
        });
    }

    private onActionError(data): void {
        this.alertsService.create('error',
            `${data[1].status}`);
    }
}