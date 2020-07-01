import { get, isEqual } from 'lodash';
import * as moment from 'moment';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subject } from 'rxjs';

abstract class DatagridParamsData {
    referenceID: number;
    fundName: string;
    shareName: string;
    isin: string;
    status: number;
    orderType: number;
    pageSize: number;
    rowOffSet: number;
    fromDate: string;
    toDate: string;
    assetManagementCompany: string;
    investorCompanyName: string;
    portfolioLabel: string;
}

export class DatagridParams {

    private defaults: DatagridParamsData;
    private data: DatagridParamsData;
    private changedSubject = new Subject<void>();
    private isFirstLoad = true;

    constructor(itemsPerPage: number) {
        this.defaults = {
            referenceID: null,
            fundName: null,
            shareName: null,
            isin: null,
            status: null,
            orderType: null,
            pageSize: itemsPerPage,
            rowOffSet: 0,
            fromDate: null,
            toDate: null,
            assetManagementCompany: null,
            investorCompanyName: null,
            portfolioLabel: null,
        };
        this.data = this.defaults;
    }

    applyState(state: ClrDatagridStateInterface) {
        const tmpData = { ...this.data };
        const fieldMap = {
            orderRef: 'orderId',
            investor: 'investorWalletID',
            portfolioLabel: 'label',
            orderType: 'orderType',
            isin: 'isin',
            fundName: 'fundName',
            shareName: 'shareName',
            shareCurrency: 'currency',
            quantity: 'quantity',
            grossAmount: 'amountWithCost',
            orderDate: 'orderDate',
            cutOffDate: 'cutoffDate',
            settlementDate: 'settlementDate',
            orderStatus: 'orderStatus',
            investorCompanyName: 'investorCompanyName',
            portfolio: 'portfolio',
            assetManagementCompany: 'assetManagementCompany',
            tradedBy: 'tradedBy',
            latestNAV: 'latestNAV',
            feesAmount: 'feesAmount',
            navDate: 'navDate',
        };

        this.data.rowOffSet = get(state, 'page.from', 0) / this.data.pageSize;

        if (!isEqual(tmpData, this.data) || this.isFirstLoad) {
            this.changedSubject.next();

            // if done first load. set it to false.
            if (this.isFirstLoad) {
                this.isFirstLoad = false;
            }
        }
    }

    get() {
        return this.data;
    }

    get changed() {
        return this.changedSubject.asObservable();
    }
}
