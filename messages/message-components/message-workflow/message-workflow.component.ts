import { Component, Input, OnInit } from '@angular/core';
import { SagaHelper } from '@setl/utils/index';
import { WalletNodeSocketService } from '@setl/websocket-service';
import { NgRedux, select } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts/index';
import { CoreWorkflowEngineService, InitialisationService, WalletNodeRequestService } from '@setl/core-req-services';
import { MessagesService } from '../../../messages.service';
import { createWalletNodeSagaRequest } from '@setl/utils/common';
import * as walletHelper from '@setl/utils/helper/wallet/index';
import { setRequestedWalletAddresses } from '@setl/core-store/wallet/my-wallet-address/actions';

/**
 * SETL Message Body Component
 *
 * Displays the Message Body
 */
@Component({
    selector: 'setl-message-workflow',
    templateUrl: './message-workflow.component.html',
    styleUrls: ['./message-workflow.component.css'],
})
export class SetlMessageWorkflowComponent implements OnInit {
    @Input() data;
    @Input() userId;
    @Input() walletId: number;
    @Input() mailId: number;
    @Input() isActed: boolean; // from db

    public decodedData;
    public disableSend = false;
    public coolDown = 5000;
    public label = '';
    public subscriptionsArray = [];
    public walletAddresses = [];

    public transferTemplate = {
//        "poa": "WFLXB.UnitQueue.275681",
        topic: 'sttra',
        amount: 1,
        address: '', // target address (gets replaced)
        tochain: 2300, // TODO: not hardcode
//        txnonce: 275681,
        metadata: '',
        walletid: 0,
        fromchain: 2300,
        namespace: 'IssuerA',
//        "publickey": "4b5d0378e7a5655e8e07bd2c3f15a328543babf4179cd793de776711a7105813",
//        "tochainid": 2300,
        instrument: 'M-Shares',
        fromaddress: '',
    };

    @select(['wallet', 'myWalletAddress', 'requested']) addressListRequestedStateOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) requestedAddressListOb;

    constructor (private walletNodeSocketService: WalletNodeSocketService,
                 private messagesService: MessagesService,
                 private ngRedux: NgRedux<any>,
                 private alertsService: AlertsService,
                 private walletNodeRequestService: WalletNodeRequestService,
                 private coreWorkflowService: CoreWorkflowEngineService) {
    }

    updateWalletAddresses (addresses) {
        const addList = walletHelper.walletAddressListToSelectItem(addresses);
        this.walletAddresses = addList.map((objAdd) => objAdd.text);
    }

    requestWalletAddressList (requestedState: boolean) {
        if (!requestedState) {
            this.ngRedux.dispatch(setRequestedWalletAddresses());
            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.walletId);
        }
    }

    ngOnInit () {
console.log("DATA", this.data)
        if (this.data && this.data['Data']) {
            try {
                this.decodedData = JSON.parse(this.data['Data']);
            } catch (e) {
                console.warn('warning, unable to decode message data', e, this.data);
            }
            if (!this.decodedData) {
                return;
            }
            // this.transferTemplate.asset = this.decodedData['asset'];
            this.transferTemplate['namespace'] = this.decodedData['asset'].split('|')[0];
            this.transferTemplate['instrument'] = this.decodedData['asset'].split('|')[1];
        }
        this.transferTemplate['walletid'] = this.walletId;

        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe((requested) => {
            this.updateWalletAddresses(requested);
        }));

        this.subscriptionsArray.push(this.addressListRequestedStateOb.subscribe((requestedState) => {
            this.requestWalletAddressList(requestedState);
        }));
    }

    doTransfer (toAddress) {

        this.disableSend = true; // prevent fat-fingered freddy from doubletapping.
        setTimeout(() => {
            this.disableSend = false;
        }, this.coolDown);

        this.transferTemplate.address = toAddress;

        for (let i = 0; i < this.data.recipients.length; i += 1) {
            const r = this.data.recipients[i];
            if (this.walletAddresses.indexOf(r) !== -1) {
                this.transferTemplate.fromaddress = this.walletAddresses[this.walletAddresses.indexOf(r)];
            }
        }
console.log(this.transferTemplate)
        const asyncTaskPipe = createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', this.transferTemplate);
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback( // Send a saga action.
            asyncTaskPipe,
            (d) => {
                this.isActed = true;
                this.showSuccessResponse('Your vote has been registered');

                this.messagesService.markMessageAsActedRequest(this.walletId, this.mailId, '0').then(
                    (res) => {
                        console.log('Flag as acted response', res);
                    }).catch((err) => {
                        console.warn('Could not set acted', err);
                    });
            },
            (e) => {
                console.error(e);
                let base = 'A server error occurred';
                const extra = (e[1] && e[1]['data'] && e[1]['data']['status']) || (e[1] && e[1]['data'] && e[1]['data']['error']) || '';
                if (extra) {
                    base += ':  ';
                }
                console.log(base + extra);
            },
        ));
    }

    showErrorResponse (message) {
        this.alertsService.create('error', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger">${message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    showSuccessResponse (message) {
        this.alertsService.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-success">${message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }
}
