import { get, isEqual } from 'lodash';
import * as moment from 'moment';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subject } from 'rxjs';

abstract class DatagridParamsData {
    referenceID: number;
    externalReference: string;
    accountKeeper: string;
    transferDirection: string;
    assetManagementCompany: string;
    investorCompany: string;
    investorWallet: string;
    shareISIN: string;
    shareName: string;
    currency: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    theoricalDate: string;
    transferStatus: string;
    dateEntered: string;
    pageSize: number;
    rowOffSet: number;
}

export class DatagridParams {

    private defaults: DatagridParamsData;
    private data: DatagridParamsData;
    private changedSubject = new Subject<void>();
    private isFirstLoad = true;

    constructor(itemsPerPage: number) {
        this.defaults = {
            pageSize: itemsPerPage,
            rowOffSet: 0,
            referenceID: null,
            externalReference: null,
            accountKeeper: null,
            transferDirection: null,
            assetManagementCompany: null,
            investorCompany: null,
            investorWallet: null,
            shareISIN: null,
            shareName: null,
            currency: null,
            quantity: null,
            unitPrice: null,
            amount: null,
            theoricalDate: null,
            transferStatus: null,
            dateEntered: null,
        };
        this.data = this.defaults;
    }

    applyState(state: ClrDatagridStateInterface) {
        const tmpData = { ...this.data };
        const fieldMap = {
            referenceID: 'referenceID',
            externalReference: 'externalReference',
            accountKeeper: 'accountKeeper',
            transferDirection: 'transferDirection',
            assetManagementCompany: 'assetManagementCompany',
            investorCompany: 'investorCompany',
            investorWallet: 'investorWallet',
            shareISIN: 'shareISIN',
            shareName: 'shareName',
            currency: 'currency',
            quantity: 'quantity',
            unitPrice: 'unitPrice',
            amount: 'amount',
            theoricalDate: 'theoricalDate',
            transferStatus: 'transferStatus',
            dateEntered: 'dateEntered',
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
