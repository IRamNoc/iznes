/* Core/Angular imports. */
import {Injectable} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
/* Membersocket and nodeSagaRequest import. */
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {SagaHelper} from '@setl/utils';
/* Import actions. */
import {
    OFI_SET_AM_HOLDERS_LIST,
    OFI_SET_INV_HOLDINGS_LIST,
    OFI_SET_BASE_CENTRALIZATION_HISTORY,
    OFI_SET_CENTRALIZATION_HISTORY,
    OFI_SET_CENTRALIZATION_REPORTS_LIST,
    ofiClearRequestedAmHolders,
    ofiClearRequestedCentralizationReports,
    ofiSetRequestedAmHolders,
    ofiSetRequestedInvHoldings,
    ofiClearRequestedInvHoldings,
    ofiSetRequestedCentralizationReports,
    ofiSetHolderDetailRequested,
    ofiClearHolderDetailRequested,
    OFI_GET_SHARE_HOLDER_DETAIL,
    SET_PRECENTRA_SHARES_DETAILS_LIST,
    SET_PRECENTRA_SHARES_LIST,
    setRequestedPrecentraSharesList,
    clearRequestedPrecentraSharesList,
    SET_PRECENTRA_FUNDS_DETAILS_LIST,
    SET_PRECENTRA_FUNDS_LIST,
    setRequestedPrecentraFundsList,
    clearRequestedPrecentraFundsList,
} from '../../ofi-store/ofi-reports';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiAmHoldersRequestBody,
    OfiBaseCentralizationHistoryRequestBody,
    OfiCentralizationHistoryRequestBody,
    OfiCentralizationReportsRequestBody,
    OfiHolderDetailRequestBody,
    OfiHolderDetailRequestData,
    OfiInvHoldingsDetailRequestData,
    OfiInvHoldingsDetailRequestBody,
    PrecentralizationRequestSharesBody,
    PrecentralizationRequestFundsBody,
} from './model';

interface CentralizationReportsData {
    search: string;
}

interface CentralizationHistoryData {
    fundShareID: any;
    dateFrom: any;
    dateTo: any;
    dateRange: any;
}

interface PrecentralizationSharesData {
    shareId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

interface PrecentralizationFundsData {
    fundId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

interface InvHoldingsData {
    walletID: any;
    amCompanyID: any;
}

@Injectable()
export class OfiReportsService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>) {
    }

    static setRequestedCentralizationReportsList(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(ofiClearRequestedCentralizationReports());
        } else {
            ngRedux.dispatch(ofiSetRequestedCentralizationReports());
        }
    }

    static defaultRequestCentralizationReportsList(ofiReportsService: OfiReportsService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(ofiSetRequestedCentralizationReports());

        // Request the list.
        const asyncTaskPipe = ofiReportsService.requestCentralizationReportsList({
            search: '',
        });

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_CENTRALIZATION_REPORTS_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static setRequestedAmHoldersList(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(ofiClearRequestedAmHolders());
        } else {
            ngRedux.dispatch(ofiSetRequestedAmHolders());
        }
    }

    static setRequestedInvHoldingsList(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(ofiClearRequestedInvHoldings());
        } else {
            ngRedux.dispatch(ofiSetRequestedInvHoldings());
        }
    }

    static setRequestedHolderDetail(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (!boolValue) {
            ngRedux.dispatch(ofiSetHolderDetailRequested());
        } else {
            ngRedux.dispatch(ofiClearHolderDetailRequested());
        }
    }

    static defaultRequestAmHoldersList(ofiReportsService: OfiReportsService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(ofiSetRequestedAmHolders());

        // Request the list.
        const asyncTaskPipe = ofiReportsService.requestAmHoldersList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_AM_HOLDERS_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestInvHoldingsList(ofiReportsService: OfiReportsService, ngRedux: NgRedux<any>, invHoldingsDetailRequestData: OfiInvHoldingsDetailRequestData) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(ofiSetRequestedInvHoldings());

        // Request the list.
        const asyncTaskPipe = ofiReportsService.requestInvHoldings(invHoldingsDetailRequestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_INV_HOLDINGS_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestHolderDetail(ofiReportsService: OfiReportsService, ngRedux: NgRedux<any>, holderDetailRequestData: OfiHolderDetailRequestData) {
        ngRedux.dispatch(ofiSetHolderDetailRequested());

        // Request the list.
        const asyncTaskPipe = ofiReportsService.requestShareHolderDetail(holderDetailRequestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_GET_SHARE_HOLDER_DETAIL],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /* PRECENTRALIZATION FUNDS */

    static setRequestedPrecentralizationFundsList(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (!boolValue) {
            ngRedux.dispatch(setRequestedPrecentraFundsList());
        } else {
            ngRedux.dispatch(clearRequestedPrecentraFundsList());
        }
    }

    static defaultRequestPrecentralizationReportsFundsList(ofiReportsService: OfiReportsService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedPrecentraFundsList());

        // Request the list.
        const asyncTaskPipe = ofiReportsService.requestPrecentralizationReportsFundsList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_PRECENTRA_FUNDS_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /* PRECENTRALIZATION SHARES */

    static setRequestedPrecentralizationSharesList(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (!boolValue) {
            ngRedux.dispatch(setRequestedPrecentraSharesList());
        } else {
            ngRedux.dispatch(clearRequestedPrecentraSharesList());
        }
    }

    static defaultRequestPrecentralizationReportsSharesList(ofiReportsService: OfiReportsService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedPrecentraSharesList());

        // Request the list.
        const asyncTaskPipe = ofiReportsService.requestPrecentralizationReportsSharesList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_PRECENTRA_SHARES_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /* PRECENTRALIZATION FUNDS */

    requestPrecentralizationReportsFundsList(): any {

        const messageBody: OfiMemberNodeBody = {
            RequestName: 'izngetsimplefunds',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestPrecentralizationReportsFundsDetailsList(data: PrecentralizationFundsData): any {
        const messageBody: PrecentralizationRequestFundsBody = {
            RequestName: 'iznprecentralisationgetfunds',
            token: this.memberSocketService.token,
            fundId: data.fundId,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
            mode: data.mode,
        };

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_PRECENTRA_FUNDS_DETAILS_LIST],
            [],
            createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            {},
        ));
    }

    /* PRECENTRALIZATION SHARES */

    requestPrecentralizationReportsSharesList(): any {

        const messageBody: OfiMemberNodeBody = {
            RequestName: 'izngetsimpleshares',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestPrecentralizationReportsSharesDetailsList(data: PrecentralizationSharesData): any {
        const messageBody: PrecentralizationRequestSharesBody = {
            RequestName: 'iznprecentralisationgetshares',
            token: this.memberSocketService.token,
            shareId: data.shareId,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
            mode: data.mode,
        };

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_PRECENTRA_SHARES_DETAILS_LIST],
            [],
            createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            {},
        ));
    }

    requestCentralizationReportsList(data: CentralizationReportsData): any {

        const messageBody: OfiCentralizationReportsRequestBody = {
            RequestName: 'getallshareinfo',
            token: this.memberSocketService.token,
            search: data.search,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestBaseCentralizationHistory(fundShareID: any): any {

        const messageBody: OfiBaseCentralizationHistoryRequestBody = {
            RequestName: 'getSingleShareBaseInfo',
            token: this.memberSocketService.token,
            fundShareID: fundShareID,
        };

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_BASE_CENTRALIZATION_HISTORY],
            [],
            createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            {},
        ));
    }

    requestCentralizationHistory(data: CentralizationHistoryData): any {

        const messageBody: OfiCentralizationHistoryRequestBody = {
            RequestName: 'getSingleShareInfo',
            token: this.memberSocketService.token,
            fundShareID: data.fundShareID,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
            dateRange: data.dateRange,
        };

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_CENTRALIZATION_HISTORY],
            [],
            createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            {},
        ));
    }

    requestAmHoldersList(): any {

        const messageBody: OfiAmHoldersRequestBody = {
            RequestName: 'izngetamholders',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestInvHoldings(data: InvHoldingsData): any {

        const messageBody: OfiInvHoldingsDetailRequestBody = {
            RequestName: 'izngetinvestorholding',
            token: this.memberSocketService.token,
            walletID: data.walletID,
            amCompanyID: data.amCompanyID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestShareHolderDetail(requestData: OfiHolderDetailRequestData): any {
        const messageBody: OfiHolderDetailRequestBody = {
            RequestName: 'izngetamholderdetail',
            token: this.memberSocketService.token,
            shareId: requestData.shareId,
            selectedFilter: requestData.selectedFilter,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Build Request
     * -------------
     * Builds a request and sends it, responsing when it completes.
     *
     * @param {options} Object - and object of options.
     *
     * @return {Promise<any>} [description]
     */
    public buildRequest(options): Promise<any> {
        /* Check for taskPipe,  */
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
}
