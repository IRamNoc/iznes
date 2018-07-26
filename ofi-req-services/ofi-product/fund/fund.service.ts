import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, Common } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { createMemberNodeSagaRequest } from '@setl/utils/common';

import {
    FundRequestMessageBody,
    HistoryRequestMessageBody,
    FundShareRequestMessageBody,
    SaveFundRequestBody,
    UpdateFundRequestBody,
    SaveFundShareRequestBody,
    UpdateFundShareRequestBody,
    SaveFundHistoryRequestBody,
    IznesCreateFundRequestBody,
    IznesUpdateFundRequestBody,
    Fund,
    IznesFundRequestMessageBody,
    IznDeleteFundDraftRequestBody
} from './fund.service.model';
import {
    setRequestedFund,
    clearRequestedFund,
    setRequestedIznesFunds,
    clearRequestedIznesFunds,
    SET_FUND_LIST,
    SET_FUND_SHARE_LIST
} from '@ofi/ofi-main/ofi-store/ofi-product/fund/fund-list/actions';
import { GET_IZN_FUND_LIST } from '../../../ofi-store/ofi-product/fund/fund-list';
import { OfiUmbrellaFundService } from "../umbrella-fund/service";

interface FundData {
    fundID?: any;
    companyId?: any;
    fundName?: any;
    fundProspectus?: any;
    fundReport?: any;
    fundLei?: any;
    sicavId?: any;
    shareID?: any;
    metadata?: any;
    issuer?: any;
    shareName?: any;
    status?: any;
}

interface HistoryData {
    fundId?: any;
    shareId?: any;
    fieldTag?: any;
    dateFrom?: any;
    dateTo?: any;
    pageNum?: any;
    pageSize?: any;
    changes?: any;
}

@Injectable()
export class OfiFundService {

    @select(['user', 'myDetail', 'accountId']) getMyAccountId;
    accountId = 0;

    constructor(private memberSocketService: MemberSocketService, private ngRedux: NgRedux<any>) {
        this.getMyAccountId.subscribe((getMyAccountId) => this.myAccountId(getMyAccountId));
    }

    static setRequested(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(clearRequestedFund());
        } else {
            ngRedux.dispatch(setRequestedFund());
        }
    }

    static defaultRequestFundList(ofiFundService: OfiFundService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedFund());

        // Request the list.
        const asyncTaskPipe = ofiFundService.requestFundList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_LIST],  // SET est en fait un GETLIST
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestIznesFundList(ofiFundService: OfiFundService, ngRedux: NgRedux<any>) {
        ngRedux.dispatch(setRequestedIznesFunds());

        // Request the list.
        const asyncTaskPipe = ofiFundService.requestIznesFundList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [GET_IZN_FUND_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    myAccountId(accountId) {
        this.accountId = accountId;
    }

    requestFundList(): any {
        const messageBody: FundRequestMessageBody = {
            RequestName: 'getfunds',
            token: this.memberSocketService.token,
            accountId: this.accountId
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Get the list of iznes funds
     *
     * @returns {any}
     */
    requestIznesFundList(): any {
        const messageBody: IznesFundRequestMessageBody = {
            RequestName: 'izngetfundlist',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestFundShareList(fData: FundData, ngRedux: NgRedux<any>): any {
        const messageBody: FundShareRequestMessageBody = {
            RequestName: 'getfundshare',
            token: this.memberSocketService.token,
            accountId: this.accountId,
            fundId: fData.fundID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveFund(fData: FundData, ngRedux: NgRedux<any>): any {

        const messageBody: SaveFundRequestBody = {
            RequestName: 'newfund',
            token: this.memberSocketService.token,
            accountId: this.accountId,   // entityId = accountID (name just changed)
            fundName: fData.fundName,
            fundProspectus: fData.fundProspectus,
            fundReport: fData.fundReport,
            fundLei: fData.fundLei,
            sicavId: fData.sicavId,
            companyId: fData.companyId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateFund(fData: FundData, ngRedux: NgRedux<any>): any {

        const messageBody: UpdateFundRequestBody = {
            RequestName: 'updatefunds',
            token: this.memberSocketService.token,
            accountId: this.accountId,   // entityId = accountID (name just changed)
            fundId: fData.fundID,
            fundName: fData.fundName,
            fundProspectus: fData.fundProspectus,
            fundReport: fData.fundReport,
            fundLei: fData.fundLei,
            sicavId: fData.sicavId,
            companyId: fData.companyId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveFundShares(fData: FundData, ngRedux: NgRedux<any>): any {

        const messageBody: SaveFundShareRequestBody = {
            RequestName: 'newfundshare',
            token: this.memberSocketService.token,
            accountId: this.accountId,   // entityId = accountID (name just changed)
            fundID: fData.fundID,
            metadata: fData.metadata,
            issuer: fData.issuer,
            shareName: fData.shareName,
            status: fData.status,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    updateFundShares(fData: FundData, ngRedux: NgRedux<any>): any {

        const messageBody: UpdateFundShareRequestBody = {
            RequestName: 'updatefundshare',
            token: this.memberSocketService.token,
            accountId: this.accountId,   // entityId = accountID (name just changed)
            shareID: fData.shareID,
            fundID: fData.fundID,
            metadata: fData.metadata,
            issuer: fData.issuer,
            shareName: fData.shareName,
            status: fData.status,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestFundHistory(hData: HistoryData, ngRedux: NgRedux<any>): any {
        const messageBody: HistoryRequestMessageBody = {
            RequestName: 'getFundModification',
            token: this.memberSocketService.token,
            fundId: hData.fundId,
            shareId: hData.shareId,
            fieldTag: hData.fieldTag,
            dateFrom: hData.dateFrom,
            dateTo: hData.dateTo,
            pageNum: hData.pageNum,
            pageSize: hData.pageSize,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveFundHistory(hData: HistoryData, ngRedux: NgRedux<any>): any {

        const messageBody: SaveFundHistoryRequestBody = {
            RequestName: 'newFundModification',
            token: this.memberSocketService.token,
            changes: hData.changes,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * new Umbrellas/Funds/Shares module
     */
    iznCreateFund(payload: Fund) {
        const messageBody: IznesCreateFundRequestBody = {
            RequestName: 'izncreatefund',
            token: this.memberSocketService.token,
            ...payload,
            principalPromoter: JSON.stringify(payload.principalPromoter),
            investmentAdvisor: JSON.stringify(payload.investmentAdvisor),
            payingAgent: JSON.stringify(payload.payingAgent),
        };
        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
        });
    }

    buildRequest(options) {
        return new Promise((resolve, reject) => {
            /* Dispatch the request. */
            this.ngRedux.dispatch(
                SagaHelper.runAsync(
                    options.successActions || [],
                    options.failActions || [],
                    options.taskPipe,
                    {},
                    (response) => {
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    }
                )
            );
        });
    }

    iznUpdateFund(id: string, payload: Fund) {
        const messageBody: IznesUpdateFundRequestBody = {
            RequestName: 'iznupdatefund',
            token: this.memberSocketService.token,
            fundID: id,
            ...payload,
            principalPromoter: JSON.stringify(payload.principalPromoter),
            investmentAdvisor: JSON.stringify(payload.investmentAdvisor),
            payingAgent: JSON.stringify(payload.payingAgent),
        };

        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
        });
    }

    iznDeleteFundDraft(ofiFundService: OfiFundService, ngRedux: NgRedux<any>, id: string) {
        // Request the list.
        const asyncTaskPipe = ofiFundService.deleteFundDraft(id);
        ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe));
    }

    deleteFundDraft(id: string): any {
        const messageBody: IznDeleteFundDraftRequestBody = {
            RequestName: 'izndeleteFundDraft',
            token: this.memberSocketService.token,
            id: id,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
