import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, Common } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import {
    IznesCreateFundRequestBody,
    IznesUpdateFundRequestBody,
    Fund,
    IznesFundRequestMessageBody,
    IznDeleteFundDraftRequestBody,
    fetchFundAuditRequestBody,
} from './fund.service.model';
import {
    setRequestedIznesFunds,
    clearRequestedIznesFunds,
    SET_FUND_AUDIT,
} from '@ofi/ofi-main/ofi-store/ofi-product/fund/fund-list/actions';
import { GET_IZN_FUND_LIST } from '../../../ofi-store/ofi-product/fund/fund-list';
import { OfiUmbrellaFundService } from '../umbrella-fund/service';

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

    requestIznesFundList(): any {
        const messageBody: IznesFundRequestMessageBody = {
            RequestName: 'izngetfundlist',
            token: this.memberSocketService.token
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

    iznDeleteFundDraft(ofiFundService: OfiFundService, ngRedux: NgRedux<any>, id: string) {
        // Request the list.
        const asyncTaskPipe = ofiFundService.deleteFundDraft(id);
        ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe));
    }

    deleteFundDraft(id: string): any {
        const messageBody: IznDeleteFundDraftRequestBody = {
            RequestName: 'izndeleteFundDraft',
            token: this.memberSocketService.token,
            id,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
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
}
