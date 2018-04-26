/* Core/Angular imports. */
import {Injectable} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeRequest, createMemberNodeSagaRequest} from '@setl/utils/common';
import {SagaHelper, Common} from '@setl/utils';

/* Import actions. */
import {
    OFI_SET_CENTRALIZATION_REPORTS_LIST,
    OFI_SET_BASE_CENTRALIZATION_HISTORY,
    OFI_SET_CENTRALIZATION_HISTORY,
    ofiSetRequestedCentralizationReports,
    ofiClearRequestedCentralizationReports,
    OFI_SET_AM_HOLDERS_LIST,
    ofiClearRequestedAmHolders,
    ofiSetRequestedAmHolders,
} from '../../ofi-store/';

/* Import interfaces for message bodies. */
import {
    OfiMemberNodeBody,
    OfiCentralizationReportsRequestBody,
    OfiAmHoldersRequestBody,
    OfiBaseCentralizationHistoryRequestBody,
    OfiCentralizationHistoryRequestBody,
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

@Injectable()
export class OfiReportsService {

    /* Constructor. */
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>) {
        /* Stub. */
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
            dateFrom: data.fundShareID,
            dateTo: data.fundShareID,
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
