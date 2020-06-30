/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import {
  IznesNewTransferRequestBody,
} from './model';
import { SagaHelper } from '@setl/utils';

@Injectable({
    providedIn: 'root',
})
export class TransferInOutService {

    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>,
    )
    {}

    fetchInvestorListByShareID(shareID: number, successCallback: (res) => void, errorCallback: (res) => void) {
        const asyncTaskPipe = this.requestInvestorsListByShareID(shareID);

        this.ngRedux.dispatch(SagaHelper.runAsync(
        [],
        [],
        asyncTaskPipe,
        {},
        res => successCallback(res),
        res => errorCallback(res),
    ));
    }

    requestInvestorsListByShareID(shareID: number) {
        const messageBody = {
            RequestName: 'izngetinvestorstransferinout',
            token: this.memberSocketService.token,
            shareID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    addNewTransfer(requestData: {
        shareIsin: string;
        investorId: number;
        portfolioId: number;
        subportfolio: string;
        transferType: string;
        transferDirection: string;
        price: number;
        quantity: number;
        theoricalDate: string;
        initialDate: string;
        externalReference: string;
        accountKeeper: number;
        comment: string;
    }): any {
        const messageBody: IznesNewTransferRequestBody = {
            RequestName: 'izncreatetransferinout',
            token: this.memberSocketService.token,
            shareIsin: requestData.shareIsin,
            investorId: requestData.investorId,
            subportfolio: requestData.subportfolio,
            transferType: requestData.transferType,
            transferDirection: requestData.transferDirection,
            price: requestData.price,
            quantity: requestData.quantity,
            theoricalDate: requestData.theoricalDate,
            initialDate: requestData.initialDate,
            externalReference: requestData.externalReference,
            accountKeeper: requestData.accountKeeper,
            comment: requestData.comment,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

}
