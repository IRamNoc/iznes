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
import { ReportingService } from '@setl/core-balances/reporting.service';

/**
 * Contract execution type
 *
 * Check balances of two assets and give them to a conversion contract.
 */
@Component({
    selector: 'setl-message-workflow2',
    templateUrl: './message-workflow.component.html',
    styleUrls: ['./message-workflow.component.css'],
})
export class SetlMessageWorkflowComponent2 implements OnInit {
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
    public wallet;
    public balances;

    public contractExecTemplate = {
        topic: '',
        address: '',
    };

    @select(['wallet', 'myWalletAddress', 'requested']) addressListRequestedStateOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) requestedAddressListOb;

    constructor (private walletNodeSocketService: WalletNodeSocketService,
                 private messagesService: MessagesService,
                 private ngRedux: NgRedux<any>,
                 private alertsService: AlertsService,
                 private walletNodeRequestService: WalletNodeRequestService,
                 private coreWorkflowService: CoreWorkflowEngineService,
                 private reportingService: ReportingService) {
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
        if (this.data && this.data['Data']) {
            try {
                this.decodedData = JSON.parse(this.data['Data']);
            } catch (e) {
                console.warn('warning, unable to decode message data', e, this.data);
            }
            if (!this.decodedData) {
                return;
            }

            this.contractExecTemplate['blah'] = this.decodedData['blah']
            this.contractExecTemplate['walletid'] = this.walletId;
        }

        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe((requested) => {
            this.updateWalletAddresses(requested);
        }));

        this.subscriptionsArray.push(this.addressListRequestedStateOb.subscribe((requestedState) => {
            this.requestWalletAddressList(requestedState);
        }));

        this.wallet = this.reportingService.getBalances();
        this.wallet.subscribe((balances) => {
            this.balances = balances;
            for (let i = 0; i < balances.length; i += 1) {
                const bal = balances[i];
                if (bal['asset'] === this.decodedData['asset']) { // TODO: check both assets
                    this.contractExecTemplate['quantity_x'] = bal['free']; // TODO; check this against the contract itself somehow.  quantity 1,2
                }
            }
        });
    }

    doTransfer (toAddress) {

        this.disableSend = true; // prevent fat-fingered freddy from doubletapping.
        setTimeout(() => {
            this.disableSend = false;
        }, this.coolDown);

        this.contractExecTemplate['address'] = toAddress;

        /*for (let i = 0; i < this.data.recipients.length; i += 1) {
            const r = this.data.recipients[i];
            if (this.walletAddresses.indexOf(r) !== -1) {
                this.contractExecTemplate.fromaddress = this.walletAddresses[this.walletAddresses.indexOf(r)];
            }
        }*/
        const asyncTaskPipe = createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', this.contractExecTemplate);
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
                this.showErrorResponse(base + extra);
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
