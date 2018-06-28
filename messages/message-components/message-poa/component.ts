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

    constructor (private walletNodeSocketService: WalletNodeSocketService,
                 private _ngRedux: NgRedux<any>,
                 private alertsService: AlertsService,) {

    }

    ngOnInit() {

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

        const asyncTaskPipe = createWalletNodeSagaRequest(this.walletNodeSocketService, 'tx', this.data);
        this._ngRedux.dispatch(SagaHelper.runAsyncCallback( // Send a saga action.
            asyncTaskPipe,
            (d) => {
                console.log(d);
                this.showSuccessResponse('POA has been signed on the blockchain');
            },
            (e) => {
                console.error(e);
                let base = 'An error occurred';
                const extra = (e[1] && e[1]['data'] && e[1]['data']['status']) || (e[1] && e[1]['data'] && e[1]['data']['error']) || '';
                if (extra) {
                    base += ':  ';
                }
                this.showErrorResponse(base + extra);
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
