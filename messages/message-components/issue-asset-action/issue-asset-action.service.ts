import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {Common, SagaHelper} from '@setl/utils';
import {WalletNodeSocketService} from '@setl/websocket-service';
import {TRANSFER_ASSET_FAIL, TRANSFER_ASSET_SUCCESS} from '@setl/core-store';

import {MessagesService} from '../../../messages.service';
import {IssueAssetActionModel} from './issue-asset-action.model';

@Injectable()
export class SetlIssueAssetActionService {

    constructor(private ngRedux: NgRedux<any>,
        private walletNodeSocketService: WalletNodeSocketService,
        private alertsService: AlertsService,
        private messagesService: MessagesService) {}

    doAction(action: IssueAssetActionModel, walletid, instrument, mailId) {
        return new Promise((resolve, reject) => {
            const instrParts = instrument[0].id.split('|');
            const payload = {
                topic: 'asiss',
                walletid,
                namespace: instrParts[0],
                instrument: instrParts[1],
                address: action.toAddress,
                amount: action.amount,
            };
            console.log('Issue funds!', payload);
            const request = Common.createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', payload);

            this.ngRedux.dispatch(SagaHelper.runAsync(
                TRANSFER_ASSET_SUCCESS,
                TRANSFER_ASSET_FAIL,
                request,
                {},
                (data) => {
                    console.log('message action success:', data);

                    this.onActionSuccess(data, walletid, mailId, resolve);
                },
                (data) => {
                    console.log('message action failed:', data);

                    this.onActionError(data);
                }
            ));
        });
    }

    private onActionSuccess(data, walletId: number, mailId: number, resolve): void {
        const hash = ((data[1]) && data[1].data.hash) ? data[1].data.hash : null;

        const markAsReadRequest = this.messagesService.markMessageAsActed(walletId, mailId, hash).then((res) => {
            const message = (hash) ? `<table class='table grid'>
                <tbody>
                    <tr>
                        <td class="left"><b>Tx hash:</b></td>
                        <td>${data[1].data.hash.substring(0, 10)}...</td>
                    </tr>
                </tbody>
            </table>` : '';

            this.alertsService.create('success', message);
            resolve();
        }).catch((e) => {
            console.log('mark mail as acted error', e);
        });
    }

    private onActionError(data): void {
        this.alertsService.create('error',
            `${data[1].status}`);
    }
}
