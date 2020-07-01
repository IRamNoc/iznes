/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import {
    IznesNewTransferRequestBody,
    IznesGetTransferRequestBody,
} from './model';
import { SagaHelper } from '@setl/utils';

@Injectable({
    providedIn: 'root',
})
export class TransferInOutService {

    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>,
    ) { }

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
        fundShareID: number;
        investorWalletID: number;
        investorSubportfolioID: number;
        transferType: string;
        transferDirection: string;
        price: number;
        quantity: number;
        theoricalDate: string;
        initialDate: string;
        externalReference: string;
        accountKeeperID: number;
        comment: string;
    }): any {
        const messageBody: IznesNewTransferRequestBody = {
            RequestName: 'izncreatetransferinout',
            token: this.memberSocketService.token,
            fundShareID: requestData.fundShareID,
            investorWalletID: requestData.investorWalletID,
            investorSubportfolioID: requestData.investorSubportfolioID,
            transferType: requestData.transferType,
            transferDirection: requestData.transferDirection,
            price: requestData.price,
            quantity: requestData.quantity,
            theoricalDate: requestData.theoricalDate,
            initialDate: requestData.initialDate,
            externalReference: requestData.externalReference,
            accountKeeperID: requestData.accountKeeperID,
            comment: requestData.comment,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    fetchIznesTransferList(successCallback: (res) => void, errorCallback: (res) => void) {
        const asyncTaskPipe = this.requestIznesTransferList({
            pageSize: 10,
            rowOffSet: 0,
        });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            res => successCallback(res),
            res => errorCallback(res),
        ));
    }

    requestIznesTransferList(data: any) {
        const messageBody: IznesGetTransferRequestBody = {
            RequestName: 'izngettransferinout',
            token: this.memberSocketService.token,
            pageSize: data.pageSize,
            rowOffset: (data.rowOffSet * data.pageSize),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
