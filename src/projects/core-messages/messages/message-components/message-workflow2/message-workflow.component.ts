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
 * Give all of a denominating asset (e.g rights token) and
 * accompanying cash asset in appropriate qty to an exchange contract.
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
    public enoughCash = false;
    public denominator = '';
    public assetRatios = {};
    public assetBalances = {};

    public contractExecTemplate = {
        topic: 'cocom',
        walletid: 0,
        address: '',
        contractdata: {
            assetsin: [
                /*[
                    'CompanyX',
                    'Rights',
                    40000,
                ],
                [
                    'BankX',
                    'GBP',
                    100000,
                ],*/
            ],
            contractfunction: 'exchange_commit',
        },
        contractaddress: '',
    }

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
        this.walletAddresses = addList.map(objAdd => objAdd.text);
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
            this.contractExecTemplate['walletid'] = this.walletId;
            this.contractExecTemplate['contractaddress'] = this.decodedData['contractaddress'];

            for (let i = 0; i < this.decodedData['assets'].length; i += 1) {
                const a = this.decodedData['assets'][i];

                this.assetRatios[a['asset']] = a['quantity']; // NOTE: our cache includes namespace
                this.setCommitQty(a['asset'], a['quantity']);

                if (i === 0) {
                    this.denominator = a['asset'];
                }
            }
            if (this.decodedData['assets'].length === 1) {
                this.enoughCash = true;
            }
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
                if (bal['asset'] === this.denominator) {
                    const multi = Math.floor(bal['free'] / this.assetRatios[this.denominator]); // if denominator is not 1, set it to the maximum value possible
                    let dqty = this.assetRatios[this.denominator] * multi;
                    dqty = dqty > 0 ? dqty : 0;
console.log('setting denominating quantity', dqty)
                    this.setCommitQty(bal['asset'], dqty);
                }
            }
            for (let i = 0; i < balances.length; i += 1) {
                const bal = balances[i];
                for (const asset in this.assetRatios) { // iterate other assets and use the ratio to set the qty.
                    if (bal['asset'] === asset && asset !== this.denominator) {
                        const ratio = this.assetRatios[asset] / this.assetRatios[this.denominator];
                        const req = this.getCommitQty(this.denominator) * ratio;
console.log('setting numerating asset', req);
                        if (bal['free'] > req) {
                            this.setCommitQty(bal['asset'], req);
                            this.enoughCash = true;
                        } else {
                            this.setCommitQty(bal['asset'], null); // ask for failure (so we can spaff a warning at the user)
                        }
                    }
                }
            }
        });
    }

    setCommitQty (fqan, qty) { // fqan = fully qualified asset name. eg. BoE|GBP
        const sn = fqan.split('|');
        const ns = sn[0];
        const asset = sn[1];
        const arr = this.contractExecTemplate['contractdata']['assetsin'];
        let found = false;

        for (let i = 0; i < arr.length; i += 1) {
            const item = arr[i];
            if (item[0] === ns && item[1] === asset) {
                item[2] = qty;
                found = true;
            }
        }
        if (!found) {
            this.contractExecTemplate['contractdata']['assetsin'].push([ns, asset, qty]);
        }
    }

    getCommitQty (fqan) {
        const sn = fqan.split('|');
        const ns = sn[0];
        const asset = sn[1];
        for (let i = 0; this.contractExecTemplate['contractdata']['assetsin'].length; i += 1) {
            const item = this.contractExecTemplate['contractdata']['assetsin'][i];
            if (item[0] === ns && item[1] === asset) {
                return item[2];
            }
        }
    }

    doTransfer () {

        this.disableSend = true; // prevent fat-fingered freddy from doubletapping.
        setTimeout(() => {
            this.disableSend = false;
        }, this.coolDown);

        for (let i = 0; i < this.data.recipients.length; i += 1) {
            const r = this.data.recipients[i];
            if (this.walletAddresses.indexOf(r) !== -1) {
                this.contractExecTemplate.address = this.walletAddresses[this.walletAddresses.indexOf(r)];
            }
        }
console.log("SENDING", this.contractExecTemplate);
        const asyncTaskPipe = createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', this.contractExecTemplate);
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (d) => {
                this.isActed = true;
                this.showSuccessResponse('Your commitment succeeded.');

                this.messagesService.markMessageAsActedRequest(this.walletId, this.mailId, '0').then(
                    (res) => {
                        console.log('Flag as acted response', res);
                    }).catch((err) => {
                        console.warn('Could not set acted', err);
                    });
            },
            (e) => { // TODO: display something for insufficient balance
                console.error(e);
                let base = 'An error occurred';
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
