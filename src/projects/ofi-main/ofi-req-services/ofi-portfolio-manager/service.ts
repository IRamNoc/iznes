/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import { SagaHelper } from '@setl/utils';
import {
    OFI_SET_PM_DETAIL,
    OFI_SET_PM_LIST,
    ofiSetRequestedPmList,
    OFI_SET_WM_DETAIL,
} from '../../ofi-store/ofi-portfolio-manager/portfolio-manage-list/actions';
import {
    OfiPortfolioManagerDetailrequestBody,
    OfiPortfolioManagerListRequestBody,
    OfiPortfolioManagerUpdateRequestBody,
    OfiWealthManagerDetailrequestBody,
    OfiWealthManagerUpdateRequestBody,
    OfiPortfolioManagerListDashboardrequestBody,
} from './model';

@Injectable()
export class OfiPortfolioMangerService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>,
    ) {
        /* Stub. */
    }

    /**
     * Get portfolio manager with default action.
     */
    defaultRequestPortpolioManagerList() {
        // Set the state flag to true. so we do not request it again.
        this.ngRedux.dispatch(ofiSetRequestedPmList());

        // Request the list.
        const asyncTaskPipe = this.requestPortfolioManagerList();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_PM_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /**
     * Get portfolio manager list
     * @return {any}
     */
    requestPortfolioManagerList(): any {
        const messageBody: OfiPortfolioManagerListRequestBody = {
            RequestName: 'iznportfoliomanagerlist',
            token: this.memberSocketService.token,
            pmid: 0,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Get portfolio manager detail with default action.
     * @param: {number} pmId
     */
    defaultRequestPortpolioManagerDetail(pmId: number) {
        // Request the list.
        const asyncTaskPipe = this.requestPortfolioManagerDetail(pmId);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_PM_DETAIL],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /**
     * Get portfolio manager detail.
     * @param: {number} pmId
     */
    requestPortfolioManagerDetail(pmId: number): any {
        const messageBody: OfiPortfolioManagerDetailrequestBody = {
            RequestName: 'iznportfoliomanagerlist',
            token: this.memberSocketService.token,
            pmid: pmId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestPortfolioManagerDetailPromise(pmId: number): any {
        const messageBody: OfiPortfolioManagerDetailrequestBody = {
            RequestName: 'iznportfoliomanagerlist',
            token: this.memberSocketService.token,
            pmid: pmId,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    /**
     * Get portfolio manager for am dashboard with default action
     * @param: none
     */
    defaultRequestPortfolioManagerListDashboard(successCallback: (res) => void, errorCallback: (res) => void) {
        const asyncTaskPipe = this.requestPortfolioManagerListDashboard();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            res => successCallback(res),
            res => errorCallback(res),
        ));
    }

    /**
     * Get portfolio manager for am dashboard
     * @param: none
     */
    requestPortfolioManagerListDashboard() {
        const messageBody: OfiPortfolioManagerListDashboardrequestBody = {
            RequestName: 'izngetallinvestorsfunds',
            token: this.memberSocketService.token,
        }

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }


    /**
     * Get portfolio manager detail with default action.
     * @param: {number} pmId
     */
    defaultRequestWealthManagerDetail(pmId: number) {
        // Request the list.
        const asyncTaskPipe = this.requestWealthManagerDetail(pmId);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_WM_DETAIL],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /**
     * Get wealth manager detail.
     * @param: {number} pmId
     */
    requestWealthManagerDetail(pmId: number): any {
        const messageBody: OfiWealthManagerDetailrequestBody = {
            RequestName: 'iznwealthmanagerlist',
            token: this.memberSocketService.token,
            pmid: pmId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Update portfolio manager fund access.
     * @param: {{pmId: number; fundId: number; status: number}} pmId
     */
    updatePortfolioManagerFundAccess(requestData: {pmId: number; fundId: number; status: number}): any {
        const messageBody: OfiPortfolioManagerUpdateRequestBody = {
            RequestName: 'iznupdatepmfundaccess',
            token: this.memberSocketService.token,
            fundid: requestData.fundId,
            pmid: requestData.pmId,
            status: requestData.status,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    /**
     * Update portfolio manager fund access.
     * @param: {{pmId: number; fundId: number; status: number}} pmId
     */
    updateWealthManagerInvestorAccess(requestData: {pmId: number; investorId: number; status: number}): any {
        const messageBody: OfiWealthManagerUpdateRequestBody = {
            RequestName: 'izneswealthmanagerupdateinvestors',
            token: this.memberSocketService.token,
            pmid: requestData.pmId,
            investorid: requestData.investorId,
            status: requestData.status,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }
}
