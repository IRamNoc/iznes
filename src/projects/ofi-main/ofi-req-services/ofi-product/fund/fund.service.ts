import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, Common } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import {createMemberNodeRequest, createMemberNodeSagaRequest} from '@setl/utils/common';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import {
    IznesCreateFundRequestBody,
    IznesUpdateFundRequestBody,
    Fund,
    IznesFundRequestMessageBody,
    IznDeleteFundDraftRequestBody,
    fetchFundAuditRequestBody,
    UploadProductsFileMessageBody,
    UploadProductsFileRequestData,
} from './fund.service.model';
import {
    setRequestedIznesFunds,
    clearRequestedIznesFunds,
    SET_FUND_AUDIT,
} from '@ofi/ofi-main/ofi-store/ofi-product/fund/fund-list/actions';
import { GET_IZN_FUND_LIST } from '../../../ofi-store/ofi-product/fund/fund-list';
import { OfiUmbrellaFundService } from '../umbrella-fund/service';

const GLOBAL_UPLOAD_MODE = 'global';
const DETAIL_UPLOAD_MODE = 'detail';

@Injectable()
export class OfiFundService {
    accountId = 0;
    isFundRequested: boolean;

    unSubscribe: Subject<any> = new Subject();

    @select(['user', 'myDetail', 'accountId']) getMyAccountId;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'requestedIznesFund']) requestedIznesFund$;
    @select(['user', 'authentication', 'isLogin']) isLogin$;

    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {

        this.isLogin$.subscribe((isLogin) => {
            if (isLogin) {
                this.initSubscribers();
                return;
            }
            this.unSubscribe.next();
            this.unSubscribe.complete();
        });
    }

    initSubscribers() {
        this.getMyAccountId
            .pipe(
                takeUntil(this.unSubscribe),
        )
            .subscribe(getMyAccountId => this.myAccountId(getMyAccountId));

        this.requestedIznesFund$
            .pipe(
                takeUntil(this.unSubscribe),
        )
            .subscribe(v => this.isFundRequested = v);
    }

    myAccountId(accountId) {
        this.accountId = accountId;
    }

    getFundList() {
        if (this.isFundRequested) {
            return;
        }
        this.fetchFundList();
    }

    getAdminFundList() {
        if (this.isFundRequested) {
            return;
        }
        this.fetchAdminFundList();
    }

    requestIznesFundList(): any {
        const messageBody: IznesFundRequestMessageBody = {
            RequestName: 'izngetfundlist',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestIznesAdminFundList(): any {
        const messageBody: IznesFundRequestMessageBody = {
            RequestName: 'izngetadminfundlist',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    fetchFundList() {
        const asyncTaskPipe = this.requestIznesFundList();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [GET_IZN_FUND_LIST],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch(setRequestedIznesFunds());
            },
        ));
    }

    fetchAdminFundList() {
        const asyncTaskPipe = this.requestIznesAdminFundList();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [GET_IZN_FUND_LIST],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch(setRequestedIznesFunds());
            },
        ));
    }

    /**
     * new Umbrellas/Funds/Shares module
     */
    iznCreateFund(payload: Fund) {
        const messageBody: IznesCreateFundRequestBody = {
            RequestName: 'izncreatefund',
            token: this.memberSocketService.token,
            ...payload,
            principlePromoterID: JSON.stringify(payload.principlePromoterID),
            investmentAdvisorID: JSON.stringify(payload.investmentAdvisorID),
            payingAgentID: JSON.stringify(payload.payingAgentID),
        };

        return this.buildRequest({
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
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
                    },
                ),
            );
        });
    }

    iznUpdateFund(id: string, payload: Fund) {
        const messageBody: IznesUpdateFundRequestBody = {
            RequestName: 'iznupdatefund',
            token: this.memberSocketService.token,
            fundID: id,
            ...payload,
            principlePromoterID: JSON.stringify(payload.principlePromoterID),
            investmentAdvisorID: JSON.stringify(payload.investmentAdvisorID),
            payingAgentID: JSON.stringify(payload.payingAgentID),
        };

        return this.buildRequest({
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
        });
    }

    deleteFundDraft(id: string): Promise<any> {
        const messageBody: IznDeleteFundDraftRequestBody = {
            RequestName: 'izndeleteFundDraft',
            token: this.memberSocketService.token,
            id,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    fetchFundAuditByFundID(fundID: number) {
        const messageBody: fetchFundAuditRequestBody = {
            RequestName: 'izngetfundaudit',
            token: this.memberSocketService.token,
            fundID,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_AUDIT],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    fetchAdminFundAuditByFundID(fundID: number) {
        const messageBody: fetchFundAuditRequestBody = {
            RequestName: 'izngetadminfundaudit',
            token: this.memberSocketService.token,
            fundID,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_AUDIT],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    fetchFundByID(fundId: number) {
        const messageBody = {
            RequestName: 'izngetfundbyid',
            token: this.memberSocketService.token,
            fundId,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [GET_IZN_FUND_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /**
     * Send the content of csv file as JSON to backend
     *
     * @param {string} mode
     * @param {UploadProductsFileRequestData} requestData
     * @param {NgRedux<any>} ngRedux
     * @param {(res) => void} successCallback
     * @param {(err) => void} errorCallback
     */
    uploadProductsFile(mode = GLOBAL_UPLOAD_MODE, requestData: UploadProductsFileRequestData, ngRedux: NgRedux<any>, successCallback: (res) => void, errorCallback: (err) => void) {
        let messageBody: UploadProductsFileMessageBody = {
            RequestName: (mode === DETAIL_UPLOAD_MODE) ? 'iznuploadproductsconfigfunds' : 'iznuploadglobalnavshares',
            token: this.memberSocketService.token,
            productsData: requestData.productsData,
        };

        if (mode === DETAIL_UPLOAD_MODE) {
            messageBody = { ...messageBody };
        }

        ngRedux.dispatch(
            SagaHelper.runAsync(
                [],
                [],
                createMemberNodeSagaRequest(this.memberSocketService, messageBody),
                {},
                res => successCallback(res),
                err => errorCallback(err),
            ),
        );
    }
}

//iznuploadglobalnavshares
// iznuploadglobalnavshares