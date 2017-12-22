import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {NgRedux} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils/index';
import {clearRequestedConnections, SET_CONNECTIONS_LIST, setRequestedConnections} from '@setl/core-store/connection';
import {
    CreateConnectionMessageBody, DeleteConnectionMessageBody, GetConnectionsMessageBody,
    UpdateConnectionMessageBody
} from './connection.service.model';

@Injectable()
export class ConnectionService {
    constructor(private memberSocketService: MemberSocketService) {
    }

    static setRequested(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedConnections());
        } else {
            ngRedux.dispatch(setRequestedConnections());
        }
    }

    static defaultRequestConnectionsList(connectionService: ConnectionService, ngRedux: NgRedux<any>, walletId: string) {
        const asyncTaskPipe = connectionService.requestConnectionsList(walletId);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_CONNECTIONS_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    requestConnectionsList(walletId: string): any {
        const messageBody: GetConnectionsMessageBody = {
            RequestName: 'glrfl',
            token: this.memberSocketService.token,
            leiId: walletId || ''
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    createConnection(requestData): any {
        const messageBody: CreateConnectionMessageBody = {
            RequestName: 'newconnection',
            token: this.memberSocketService.token,
            leiId: requestData.leiId,
            senderLeiId: requestData.senderLeiId,
            address: requestData.address,
            connectionId: requestData.connectionId || 0,
            status: requestData.status || 1
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateConnection(requestData): any {
        const messageBody: UpdateConnectionMessageBody = {
            RequestName: 'updateconnection',
            token: this.memberSocketService.token,
            leiId: requestData.leiId,
            senderLei: requestData.senderLei,
            keyDetail: requestData.keyDetail
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    deleteConnection(requestData): any {
        const messageBody: DeleteConnectionMessageBody = {
            RequestName: 'deleteconnection',
            token: this.memberSocketService.token,
            leiId: requestData.leiId,
            senderLei: requestData.senderLei
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
