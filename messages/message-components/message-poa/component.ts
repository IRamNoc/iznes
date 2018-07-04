import {Component, Input, OnInit} from '@angular/core';
import {SagaHelper} from '@setl/utils/index';
import {WalletNodeSocketService} from '@setl/websocket-service';
import {createWalletNodeSagaRequest} from '@setl/utils/common';
import {NgRedux} from '@angular-redux/store';
import {AlertsService} from '@setl/jaspero-ng2-alerts/index';
/**
 * SETL Message Body Component
 *
 * Displays the Message Body
 */
@Component({
    selector: 'setl-message-poa',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class SetlMessagePOAComponent implements OnInit {

    @Input() data;
    messageBody: string = '';
    canAct = true;
    inProgress = false;
    knownPOAs = null;

    constructor (private walletNodeSocketService: WalletNodeSocketService,
                 private _ngRedux: NgRedux<any>,
                 private alertsService: AlertsService,) {

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
        try {
            this.knownPOAs = JSON.parse(window.localStorage.getItem('activatedPOAs')); // TODO: ask the wallet node about the POA
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
        nsreg: 'Register Namespace',
        nstra: 'Transfer Namespace',
        txnul: 'Null transaction',
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
        wmetx: 'WFL outgoing transactional messages'
    };

    prettyTime (unixTime) {
        unixTime = '' + unixTime + '000';
        const d = new Date();
        d.setTime(unixTime);
        return d.toString();
    };

    prettyNames (txType) {
        return '' + this.txNames[txType] + ' (' + txType + ')';
    }

    acceptPoa () {

        this.inProgress = true;
console.log(JSON.stringify(this.data));
        const asyncTaskPipe = createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', this.data);
        this._ngRedux.dispatch(SagaHelper.runAsyncCallback( // Send a saga action.
            asyncTaskPipe,
            (d) => {
                console.log("NON ERROR RESPONSE", d);
                this.showSuccessResponse('POA has been signed on the blockchain');
                this.canAct = false;
                this.inProgress = false;
                this.knownPOAs.push(this.data['poareference']);
                window.localStorage.setItem('activatedPOAs', JSON.stringify(this.knownPOAs));
            },
            (e) => {
                console.error(e);
                let base = 'An error occurred';
                const extra = (e[1] && e[1]['data'] && e[1]['data']['status']) || (e[1] && e[1]['data'] && e[1]['data']['error']) || '';
                if (extra) {
                    base += ':  ';
                }
                this.showErrorResponse(base + extra);
                this.inProgress = false;
            }
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
