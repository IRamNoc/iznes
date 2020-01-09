import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {NgRedux} from '@angular-redux/store';
import {SagaHelper} from '@setl/utils/index';

import {
    clearRequestedFromConnections, clearRequestedToConnections, SET_FROM_CONNECTION_LIST, SET_TO_CONNECTION_LIST,
    setRequestedFromConnections, setRequestedToConnections
} from '@setl/core-store/connection/my-connections';
import {
    CreateConnectionMessageBody, DeleteConnectionMessageBody, GetFromConnectionMessageBody,
    GetToConnectionMessageBody, UpdateConnectionMessageBody
} from './connection.service.model';

@Injectable()
export class ConnectionService {
    constructor(private memberSocketService: MemberSocketService) {
    }

    static setRequestedFromConnections(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedFromConnections());
        } else {
            ngRedux.dispatch(setRequestedFromConnections());
        }
    }

    static setRequestedToConnections(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedToConnections());
        } else {
            ngRedux.dispatch(setRequestedToConnections());
        }
    }

    static requestFromConnectionList(connectionService: ConnectionService, ngRedux: NgRedux<any>, walletId: string) {
        const asyncTaskPipe = connectionService.getFromConnectionList(walletId);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FROM_CONNECTION_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static requestToConnectionList(connectionService: ConnectionService, ngRedux: NgRedux<any>, walletId: string) {
        const asyncTaskPipe = connectionService.getToConnectionList(walletId);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_TO_CONNECTION_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    getFromConnectionList(walletId: string): any {
        const messageBody: GetFromConnectionMessageBody = {
            RequestName: 'glrfl',
            token: this.memberSocketService.token,
            leiId: walletId || ''
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getToConnectionList(walletId: string): any {
        const messageBody: GetToConnectionMessageBody = {
            RequestName: 'glrtl',
            token: this.memberSocketService.token,
            senderLei: walletId || ''
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
