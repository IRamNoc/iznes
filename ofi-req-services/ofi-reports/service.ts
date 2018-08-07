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
    ofiClearRequestedCentralisationHistoryReports,
    ofiSetRequestedAmHolders,
    ofiSetRequestedInvHoldings,
    ofiClearRequestedInvHoldings,
    ofiSetRequestedCentralisationHistoryReports,
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
    SET_CENTRA_SHARES_DETAILS_LIST,
    SET_CENTRA_SHARES_LIST,
    setRequestedCentraSharesList,
    clearRequestedCentraSharesList,
    SET_CENTRA_FUNDS_DETAILS_LIST,
    SET_CENTRA_FUNDS_LIST,
    setRequestedCentraFundsList,
    clearRequestedCentraFundsList,
} from '../../ofi-store/ofi-reports';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiAmHoldersRequestBody,
    OfiBaseCentralisationHistoryRequestBody,
    OfiCentralisationHistoryRequestBody,
    OfiCentralisationReportsRequestBody,
    OfiHolderDetailRequestBody,
    OfiHolderDetailRequestData,
    OfiInvHoldingsDetailRequestData,
    OfiInvHoldingsDetailRequestBody,
    CentralisationRequestSharesBody,
    CentralisationRequestFundsBody,
    PrecentralisationRequestSharesBody,
    PrecentralisationRequestFundsBody,
} from './model';

import {LogService} from '@setl/utils';

interface CentralisationReportsData {
    search: string;
}

interface CentralisationHistoryData {
    fundShareID: any;
    dateFrom: any;
    dateTo: any;
    dateRange: any;
}

interface CentralisationSharesData {
    shareId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

interface CentralisationFundsData {
    fundId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

interface PrecentralisationSharesData {
    shareId: number;
    dateFrom: string;
    dateTo: string;
    mode: number;
}

interface PrecentralisationFundsData {
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
                private logService: LogService,
                private ngRedux: NgRedux<any>) {
    }

    static setRequestedCentralisationReportsList(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(ofiClearRequestedCentralisationHistoryReports());
        } else {
            ngRedux.dispatch(ofiSetRequestedCentralisationHistoryReports());
        }
    }

    static defaultRequestCentralisationReportsList(ofiReportsService: OfiReportsService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(ofiSetRequestedCentralisationHistoryReports());

        // Request the list.
        const asyncTaskPipe = ofiReportsService.requestCentralisationReportsList({
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

    /* CENTRALIZATION FUNDS */

    static setRequestedCentralisationFundsList(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (!boolValue) {
            ngRedux.dispatch(setRequestedCentraFundsList());
        } else {
            ngRedux.dispatch(clearRequestedCentraFundsList());
        }
    }

    static defaultRequestCentralisationReportsFundsList(ofiReportsService: OfiReportsService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedCentraFundsList());

        // Request the list.
        const asyncTaskPipe = ofiReportsService.requestCentralisationReportsFundsList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_CENTRA_FUNDS_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /* PRECENTRALIZATION FUNDS */

    static setRequestedPrecentralisationFundsList(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (!boolValue) {
            ngRedux.dispatch(setRequestedPrecentraFundsList());
        } else {
            ngRedux.dispatch(clearRequestedPrecentraFundsList());
        }
    }

    static defaultRequestPrecentralisationReportsFundsList(ofiReportsService: OfiReportsService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedPrecentraFundsList());

        // Request the list.
        const asyncTaskPipe = ofiReportsService.requestPrecentralisationReportsFundsList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_PRECENTRA_FUNDS_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /* CENTRALIZATION SHARES */

    static setRequestedCentralisationSharesList(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (!boolValue) {
            ngRedux.dispatch(setRequestedCentraSharesList());
        } else {
            ngRedux.dispatch(clearRequestedCentraSharesList());
        }
    }

    static defaultRequestCentralisationReportsSharesList(ofiReportsService: OfiReportsService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedCentraSharesList());

        // Request the list.
        const asyncTaskPipe = ofiReportsService.requestCentralisationReportsSharesList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_CENTRA_SHARES_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /* PRECENTRALISATION SHARES */

    static setRequestedPrecentralisationSharesList(boolValue: boolean, ngRedux: NgRedux<any>) {
        if (!boolValue) {
            ngRedux.dispatch(setRequestedPrecentraSharesList());
        } else {
            ngRedux.dispatch(clearRequestedPrecentraSharesList());
        }
    }

    static defaultRequestPrecentralisationReportsSharesList(ofiReportsService: OfiReportsService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedPrecentraSharesList());

        // Request the list.
        const asyncTaskPipe = ofiReportsService.requestPrecentralisationReportsSharesList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_PRECENTRA_SHARES_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /* CENTRALISATION FUNDS */

    requestCentralisationReportsFundsList(): any {

        const messageBody: OfiMemberNodeBody = {
            RequestName: 'izngetsimplefunds',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestCentralisationReportsFundsDetailsList(data: CentralisationFundsData): any {
        const messageBody: CentralisationRequestFundsBody = {
            RequestName: 'izncentralisationgetfunds',
            token: this.memberSocketService.token,
            fundId: data.fundId,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
            mode: data.mode,
        };

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_CENTRA_FUNDS_DETAILS_LIST],
            [],
            createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            {},
        ));
    }

    /* CENTRALISATION SHARES */

    requestCentralisationReportsSharesList(): any {

        const messageBody: OfiMemberNodeBody = {
            RequestName: 'izngetsimpleshares',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestCentralisationReportsSharesDetailsList(data: CentralisationSharesData): any {
        const messageBody: CentralisationRequestSharesBody = {
            RequestName: 'izncentralisationgetshares',
            token: this.memberSocketService.token,
            shareId: data.shareId,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
            mode: data.mode,
        };

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_CENTRA_SHARES_DETAILS_LIST],
            [],
            createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            {},
        ));
    }

    /* PRECENTRALISATION FUNDS */

    requestPrecentralisationReportsFundsList(): any {

        const messageBody: OfiMemberNodeBody = {
            RequestName: 'izngetsimplefunds',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestPrecentralisationReportsFundsDetailsList(data: PrecentralisationFundsData): any {
        const messageBody: PrecentralisationRequestFundsBody = {
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

    /* PRECENTRALISATION SHARES */

    requestPrecentralisationReportsSharesList(): any {

        const messageBody: OfiMemberNodeBody = {
            RequestName: 'izngetsimpleshares',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestPrecentralisationReportsSharesDetailsList(data: PrecentralisationSharesData): any {
        const messageBody: PrecentralisationRequestSharesBody = {
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

    /* END CENTRA + PRECENTRA */

    requestCentralisationReportsList(data: CentralisationReportsData): any {

        const messageBody: OfiCentralisationReportsRequestBody = {
            RequestName: 'getallshareinfo',
            token: this.memberSocketService.token,
            search: data.search,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestBaseCentralisationHistory(fundShareID: any): any {

        const messageBody: OfiBaseCentralisationHistoryRequestBody = {
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

    requestCentralisationHistory(data: CentralisationHistoryData): any {

        const messageBody: OfiCentralisationHistoryRequestBody = {
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
