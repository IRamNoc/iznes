import { Component, Input, OnInit } from '@angular/core';
import { SagaHelper } from '@setl/utils/index';
import { WalletNodeSocketService } from '@setl/websocket-service';
import { NgRedux } from '@angular-redux/store';
import { AlertsService } from '@setl/jaspero-ng2-alerts/index';
import { CoreWorkflowEngineService } from '@setl/core-req-services';
/**
 * SETL Message Body Component
 *
 * Displays the Message Body
 */
@Component({
    selector: 'setl-message-alert',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
})
export class SetlMessageAlertComponent implements OnInit {

    @Input() data;
    @Input() userId;
    messageBody: string = '';

    public xparam = {
        userid: '',
        Header: {
            Transaction: '',
            Variant: 'T',
            Action: 'Set',
            Issuer: '',
            UnitID: '0',
            XParams: {
            }, // 'ParamName': 'ParamValue'
        },
    };

    private templateDetails;

    constructor (private walletNodeSocketService: WalletNodeSocketService,
                 private ngRedux: NgRedux<any>,
                 private alertsService: AlertsService,
                 private coreWorkflowService: CoreWorkflowEngineService) {
    }

    ngOnInit() {
        this.templateDetails = JSON.parse(this['data']['TemplateDetails']);
        this.xparam['Header']['Transaction'] = this.templateDetails && this.templateDetails['transaction'] || '';
        this.xparam['Header']['Issuer'] = this.data['Address'] || '';
        this.xparam['Header']['UnitID'] = this.data['UnitID'] || '';
        this.xparam['userid'] = this.userId;
    }

    canShowButton(option) {
        return (this.data['Options'].indexOf(option) > -1);
    }

    sendXparam(type) {
        const val = type.charCodeAt(0);
        this.xparam['Header']['XParams'] = {};
        this.xparam['Header']['XParams'][this.data['Xparam']] = val;
        this.performPost(this.xparam, (r) => {
            if (r[1]['Data'] && r[1]['Data'][0] && r[1]['Data'][0]['error']) {
                console.error(r[1]['Data'][0]);
                return this.showSuccessResponse('Server error occurred.');
            }
            this.showSuccessResponse('Workflow engine notified of your choice.');
        }, (e) => {
            console.error(e);
            this.showErrorResponse('Unable to send parameter');
        });
    }

    performPost(data, fnSuccess, fnFail) {
        const asyncTaskPipe = this.coreWorkflowService.requestNew(data);
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback( // Send a saga action.
            asyncTaskPipe,
            fnSuccess,
            fnFail,
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
