import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { CreateConnectionMessageBody, GetConnectionsMessageBody } from './connection.service.model';

@Injectable()
export class ConnectionService {
    constructor(private memberSocketService: MemberSocketService) {
    }

    getMyConnections(walletId: string): any {
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
            leiId: requestData.leiId || '',
            senderLeiId: requestData.senderLeiId || '',
            address: requestData.address || '',
            connectionId: requestData.connectionId || 0,
            status: requestData.status || 1
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
