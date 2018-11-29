import { Component, Input, OnInit } from '@angular/core';
import { SagaHelper } from '@setl/utils/index';
import { WalletNodeSocketService } from '@setl/websocket-service';
import { createWalletNodeSagaRequest } from '@setl/utils/common';
import { NgRedux } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts/index';
import { MessagesService } from '../../../messages.service';

/**
 * SETL Message Body Component
 *
 * Displays the Message Body
 */
@Component({
    selector: 'setl-message-poa',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
})
export class SetlMessagePOAComponent implements OnInit {

    @Input() walletId: number;
    @Input() mailId: number;
    @Input() data;
    @Input() isActed: boolean; // from db
    canAct = true; // determined from poa data itself.
    messageBody: string = '';

    inProgress = false;
    knownPOAs = null;

    constructor (private walletNodeSocketService: WalletNodeSocketService,
                 private ngRedux: NgRedux<any>,
                 private alertsService: AlertsService,
                 private messagesService: MessagesService) {
    }

    ngOnInit() {
        const now = new Date();
        const expiry = new Date();
        const ets = this.data && this.data.enddate + '000' || '0';
        expiry.setTime(parseInt(ets, 10));

        if (expiry < now) {
            this.canAct = false;
            return;
        }
        try { // TODO: ask the wallet node about the POA
            this.knownPOAs = JSON.parse(window.localStorage.getItem('activatedPOAs'));
        } catch (e) {

        }
        if (!this.knownPOAs) {
            this.knownPOAs = [];
            window.localStorage.setItem('activatedPOAs', '[]');
        }
        if (this.knownPOAs.indexOf(this.data['poareference']) !== -1) {
            this.canAct = false;
        }
    }

    public txNames = {
        adreg: 'Register Address',
        asdel: 'Delete Asset',
        asiss: 'Issue Asset',
        asloc: 'Lock Asset',
        asreg: 'Register Asset',
        asunl: 'Unlock Asset',
        sttra: 'Transfer Asset',
        cocan: 'Cancel Contract',
        cocom: 'Commit to Contract',
        conew: 'Create Contract',
        conot: 'Notify Contract',
        istra: 'Issuer transfer',
        istfm: 'Cancel Asset',
        nsreg: 'Register Namespace',
        nstra: 'Transfer Namespace',
        txnul: 'Read Balance',
        trtom: 'Transfer to many',
        txraw: 'Raw transaction',
        xcadd: 'Add Cross Chain',
        xcdel: 'Remove Cross Chain',
        encum: 'Encumber',
        unenc: 'Unencumber',
        aslck: 'Lock asset',
        asrel: 'Unlock asset',
        woffch: 'WFL off-chain transaction',
        wmsgs: 'WFL external communication',
        wmeadv: 'WFL outgoing notifications',
        wmetx: 'WFL outgoing transactional messages',
    };

    prettyTime (unixTime) {
        unixTime = '' + unixTime + '000';
        const d = new Date();
        d.setTime(unixTime);
        return d.toString();
    }

    prettyNames (txType) {
        return '' + this.txNames[txType] + ' (' + txType + ')';
    }

    acceptPoa () {
        this.inProgress = true;

        const asyncTaskPipe = createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', this.data);
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback( // Send a saga action.
            asyncTaskPipe,
            (d) => {
                console.log('WalletNode response to PoA', d);
                this.canAct = false;
                this.inProgress = false;
                this.knownPOAs.push(this.data['poareference']);
                window.localStorage.setItem('activatedPOAs', JSON.stringify(this.knownPOAs)); // use new user storage?
                this.showSuccessResponse('POA has been signed on the blockchain');

                const req = this.messagesService.markMessageAsActedRequest(this.walletId, this.mailId, '0').then(
                    (res) => {
                        console.log('Flag as acted response', res);
                    }).catch((err) => {
                        console.error('Could not set acted', err);
                    });
            },
            (e) => {
                console.error(e);
                let base = 'An error occurred';
                const extra = (e[1] && e[1]['data'] && e[1]['data']['status']) ||
                    (e[1] && e[1]['data'] && e[1]['data']['error']) || '';
                if (extra) {
                    base += ':  ';
                }
                this.showErrorResponse(base + extra);
                this.inProgress = false;
            },
        ));
    }

    showErrorResponse (message) { // response could be an obj or str. here
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
