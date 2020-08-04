/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import {
    IznesNewTransferRequestBody,
    IznesGetTransferRequestBody,
    IznesCancelTransferRequestBody,
    CancelTransferRequestData,
    IznesUpdateTransferRequestData,
    IznesUpdateTransferRequestBody,
    ConfirmTransferRequestData,
    IznesConfirmTransferRequestBody,
    ValidateTransferRequestData,
    IznesValidateTransferRequestBody,
} from './model';

/* Import actions. */
import {
    OFI_SET_MANAGE_TRANSFER_LIST,
    ofiManageTransferActions,
    ofiSetRequestedManageTransfer,
    ofiClearRequestedManageTransfer,
} from '../ofi-store/';

import { SagaHelper } from '@setl/utils';

@Injectable({
    providedIn: 'root',
})
export class TransferInOutService {

    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>,
    ) { }

    setOrderListPage(page: number) {
        this.ngRedux.dispatch(ofiManageTransferActions.setCurrentPage(page));
    }

    setTotalResults(results: number) {
        this.ngRedux.dispatch(ofiManageTransferActions.setTotalResults(results));
    }

    incrementTotalResults() {
        this.ngRedux.dispatch(ofiManageTransferActions.incrementTotalResults());
    }

    static setRequested(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(ofiClearRequestedManageTransfer());
        } else {
            ngRedux.dispatch(ofiSetRequestedManageTransfer());
        }
    }

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
            rowOffset: 0,
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
            rowOffset: (data.rowOffset * data.pageSize),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    defaultRequestManageTransfersList() {
    // Set the state flag to true. so we do not request it again.
        this.ngRedux.dispatch(ofiSetRequestedManageTransfer());

    // Request the list.
        const asyncTaskPipe = this.requestManageTransfersList({
            pageSize: 10,
            rowOffSet: 0,
        });

        this.ngRedux.dispatch(SagaHelper.runAsync(
        [OFI_SET_MANAGE_TRANSFER_LIST],
        [],
        asyncTaskPipe,
        {},
    ));
    }

    requestManageTransfersList(data: any): any {
        const messageBody: IznesGetTransferRequestBody = {
            RequestName: 'izngettransferinout',
            token: this.memberSocketService.token,
            pageSize: data.pageSize,
            rowOffset: (data.rowOffSet * data.pageSize),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    defaultRequestCancelTransfer(referenceID: number, successCallback: (res) => void, errorCallback: (res) => void) {
        const asyncTaskPipe = this.requestCancelTransfer({ referenceID });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            res => successCallback(res),
            res => errorCallback(res),
        ));
    }

    requestCancelTransfer(data: CancelTransferRequestData) {
        const messageBody: IznesCancelTransferRequestBody = {
            RequestName: 'izncanceltransferinout',
            token: this.memberSocketService.token,
            referenceID: data.referenceID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    defaultRequestUpdateTransfer(
        data: IznesUpdateTransferRequestData,
        successCallback: (res) => void,
        errorCallback: (res) => void) {
        const asyncTaskPipe = this.requestUpdateTransfer(data);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            res => successCallback(res),
            res => errorCallback(res),
        ));
    }

    requestUpdateTransfer(data: IznesUpdateTransferRequestData) {
        const messageBody: IznesUpdateTransferRequestBody = {
            RequestName: 'iznupdatetransferinout',
            token: this.memberSocketService.token,
            ...data,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    defaultRequestConfirmTransfer(referenceID: number, successCallback: (res) => void, errorCallback: (res) => void) {
        const asyncTaskPipe = this.requestConfirmTransfer({ referenceID });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            res => successCallback(res),
            res => errorCallback(res),
        ));
    }

    requestConfirmTransfer(data: ConfirmTransferRequestData) {
        const messageBody: IznesConfirmTransferRequestBody = {
            RequestName: 'iznconfirmtransferinout',
            token: this.memberSocketService.token,
            referenceID: data.referenceID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    defaultRequestValidateTransfer(referenceID: number, successCallback: (res) => void, errorCallback: (res) => void) {
        const asyncTaskPipe = this.requestValidateTransfer({ referenceID });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            res => successCallback(res),
            res => errorCallback(res),
        ));
    }

    requestValidateTransfer(data: ValidateTransferRequestData) {
        const messageBody: IznesValidateTransferRequestBody = {
            RequestName: 'iznvalidatetransferinout',
            token: this.memberSocketService.token,
            referenceID: data.referenceID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
    /*

    defaultRequestConfirmTransfer(referenceID: number, successCallback: (res) => void, errorCallback: (res) => void) {
        const asyncTaskPipe = this.requestConfirmTransfer({ referenceID });

        this.ngRedux.dispatch(SagaHelper.runAsync(
                [],
                [],
                asyncTaskPipe,
                {},
                res => successCallback(res),
                res => errorCallback(res),
            ));
    }

    requestConfirmTransfer(data: IznesConfirmTransferRequestData) {
        const messageBody: IznesConfirmTransferRequestBody = {
            RequestName: 'iznconfirmtransferinout',
            token: this.memberSocketService.token,
            referenceID: data.referenceID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
    */
}
