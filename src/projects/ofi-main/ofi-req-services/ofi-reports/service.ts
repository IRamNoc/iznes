/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest, createMemberNodeRequest } from '@setl/utils/common';
import { SagaHelper } from '@setl/utils';
/* Import actions. */
import {
    OFI_SET_AM_HOLDERS_LIST,
    OFI_SET_INV_HOLDINGS_LIST,
    ofiClearRequestedAmHolders,
    ofiSetRequestedAmHolders,
    ofiSetRequestedInvHoldings,
    ofiClearRequestedInvHoldings,
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
    MemberNodeMessageBody,
    OfiAmHoldersRequestBody,
    OfiHolderDetailRequestBody,
    OfiHolderDetailRequestData,
    InvestorHoldingRequestData,
    InvestorHoldingRequestBody,
    PrecentralisationRequestSharesBody,
    PrecentralisationRequestFundsBody,
    PrecentralisationFundsRequestData,
    PrecentralisationSharesRequestData,
    CentralisationRequestSharesBody,
    CentralisationRequestFundsBody,
    CentralisationFundsRequestData,
    CentralisationSharesRequestData,
    AMGenerateAICRequestBody,
    AMGenerateAICRequestData
} from './model';

@Injectable()
export class OfiReportsService {

    /* Constructor. */
    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {
    }

    static setRequestedAmHoldersList(boolValue: boolean, ngRedux: NgRedux<any>) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            ngRedux.dispatch(ofiClearRequestedAmHolders());
        } else {
            ngRedux.dispatch(ofiSetRequestedAmHolders());
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

      /* GENERATE AIC */

      defaultRequestGenerateAICAM(data: AMGenerateAICRequestData, successCallback: (res) => void, errorCallback: (res) => void) {
        // Request the list.
        const asyncTaskPipe = this.requestGenerateAICAM(data);
    
        this.ngRedux.dispatch(SagaHelper.runAsync(
          [],
          [],
          asyncTaskPipe,
          {},
          res => successCallback(res),
          res => errorCallback(res),
        ));
      }
    
      requestGenerateAICAM(data: AMGenerateAICRequestData): any {
        const messageBody: AMGenerateAICRequestBody = {
          RequestName: 'izngenerateaicam',
          token: this.memberSocketService.token,
          fromDate: data.fromDate,
          isin: data.isin,
          subportfolio: data.subportfolio,
          allClientNameList:data.allClientNameList
        };
    
        return createMemberNodeRequest(this.memberSocketService, messageBody);
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

    clearInvestorHoldingList() {
        this.ngRedux.dispatch(ofiClearRequestedInvHoldings());
    }

    fetchInvestorHoldingList(data) {
        const asyncTaskPipe = this.requestInvestorHoldingList(data);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_INV_HOLDINGS_LIST],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch(ofiSetRequestedInvHoldings());
            },
        ));
    }

    /* CENTRALISATION FUNDS */
    requestCentralisationReportsFundsList(): any {
        const messageBody: MemberNodeMessageBody = {
            RequestName: 'izngetsimplefunds',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestCentralisationReportsFundsDetailsList(data: CentralisationFundsRequestData): any {
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
        const messageBody: MemberNodeMessageBody = {
            RequestName: 'izngetsimpleshares',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestCentralisationReportsSharesDetailsList(data: CentralisationSharesRequestData): any {
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
        const messageBody: MemberNodeMessageBody = {
            RequestName: 'izngetsimplefunds',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestPrecentralisationReportsFundsDetailsList(data: PrecentralisationFundsRequestData): any {
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
        const messageBody: MemberNodeMessageBody = {
            RequestName: 'izngetsimpleshares',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestPrecentralisationReportsSharesDetailsList(data: PrecentralisationSharesRequestData): any {
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

    requestAmHoldersList(): any {
        const messageBody: OfiAmHoldersRequestBody = {
            RequestName: 'iznrecordkeepinggetall',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestInvestorHoldingList(requestData: InvestorHoldingRequestData): any {
        const messageBody: InvestorHoldingRequestBody = {
            RequestName: 'izngetinvestorholding',
            token: this.memberSocketService.token,
            walletID: requestData.walletID,
            amCompanyID: requestData.amCompanyID,
            accountID: requestData.accountID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestShareHolderDetail(requestData: OfiHolderDetailRequestData): any {
        const messageBody: OfiHolderDetailRequestBody = {
            RequestName: 'iznrecordkeepinggetshare',
            token: this.memberSocketService.token,
            shareId: requestData.shareId,
            selectedFilter: requestData.selectedFilter,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestMyHoldingDetail(requestData): any {
        const messageBody = {
            RequestName: 'izngetmyholdingdetail',
            token: this.memberSocketService.token,
            walletId: requestData.walletId,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }
}
