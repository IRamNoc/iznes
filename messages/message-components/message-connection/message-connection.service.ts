import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {Common, SagaHelper} from '@setl/utils';
import {MemberSocketService, WalletNodeSocketService} from '@setl/websocket-service';

import {MessageConnection} from './message-connection.model';

@Injectable()
export class SetlMessageConnectionService {
    constructor(private ngRedux: NgRedux<any>,
                private memberSocketService: MemberSocketService,
                private walletNodeSocketService: WalletNodeSocketService,
                private alertsService: AlertsService) {
    }

    doAction(action: MessageConnection, message: string) {
        let messageBody = {
            RequestName: action.payload.topic,
            token: this.memberSocketService.token,
        };

        messageBody = Object.assign({}, messageBody, action.payload);

        const asyncTaskPipe = Common.createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                this.onActionSuccess(data, message);
            },
            (data) => {
                this.onActionError(data);
            }
        ));
    }

    private onActionSuccess(data, message: string): void {
        if (data[1].Status === 'OK') {
            this.alertsService.create('success', message);
        } else {
            console.log('connection onActionSuccess error');
        }
    }

    private onActionError(data): void {
        this.alertsService.create('error', `${data[1].status}`);
    }
}
