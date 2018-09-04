import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, Common } from '@setl/utils';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import {
    GetTransactionMessageBody,
    GetTransactionsMessageBody,
} from './model';

@Injectable({ providedIn: 'root' })
export class ReportingService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    getTransaction(walletId: number, txHash: string): any {
        const messageBody: GetTransactionMessageBody = {
            RequestName: 'repgettx',
            token: this.memberSocketService.token,
            walletId,
            txHash,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getTransactions(walletId: number, before: { timestamp: number, address: string, nonce: number } | {} = {} ): any {
        if (!before) {
            before = {};
        }
        const messageBody: GetTransactionsMessageBody = {
            RequestName: 'repgettxs',
            token: this.memberSocketService.token,
            walletId,
            before,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getTransactionsByAsset(
        walletId: number,
        namespace: string,
        classId: string,
        before: { timestamp: number, address: string, nonce: number } | {} = {},
    ): any {
        if (!before) {
            before = {};
        }
        const messageBody: GetTransactionsMessageBody = {
            RequestName: 'repgettxsbyasset',
            token: this.memberSocketService.token,
            walletId,
            namespace,
            classId,
            before,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
