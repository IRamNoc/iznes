import { SearchFilters, ISearchFilters } from './search-filters';
import { get, isEqual } from 'lodash';
import * as moment from 'moment';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subject } from 'rxjs';

type SortOrder = 'asc' | 'desc';

abstract class DatagridParamsData {
    orderID: number;
    fundName: string;
    shareName: string;
    isin: string;
    status: number;
    orderType: number;
    pageSize: number;
    rowOffSet: number;
    sortByField: string;
    sortOrder: SortOrder;
    dateSearchField: string;
    fromDate: string;
    toDate: string;
}

export class DatagridParams {

    private defaults: DatagridParamsData;
    private data: DatagridParamsData;
    private changedSubject = new Subject<void>();

    constructor(itemsPerPage: number) {
        this.defaults = {
            fundName: null,
            shareName: null,
            isin: null,
            status: null,
            orderType: null,
            orderID: null,
            pageSize: itemsPerPage,
            rowOffSet: 0,
            sortByField: 'orderId',
            sortOrder: 'desc',
            dateSearchField: null,
            fromDate: null,
            toDate: null,
        };
        this.data = this.defaults;
    }

    setSearchFilters(searchFilters: ISearchFilters) {
        const tmpData = { ...this.data };
        const searchValues = searchFilters.getForm().value;
        this.data.orderID = get(searchValues, 'orderID', null);
        this.data.fundName = get(searchValues, 'fundname', null);
        this.data.shareName = get(searchValues, 'sharename', null);
        this.data.isin = get(searchValues, 'isin', null);

        this.data.status = get(searchValues, ['status', '0', 'id'], null);
        const orderType = get(searchValues, ['type', '0', 'id'], null);
        this.data.orderType = orderType === 0 ? null : orderType;

        this.data.dateSearchField = get(searchValues, ['dateType', '0', 'id'], false);
        const fromDate = moment(get(searchValues, ['fromDate'], null), 'YYYY-MM-DD');
        const toDate = moment(get(searchValues, ['toDate'], null), 'YYYY-MM-DD').add(1, 'days').subtract(1, 'minutes');

        this.data.fromDate = fromDate.format('YYYY-MM-DD HH:mm');
        this.data.toDate = toDate.format('YYYY-MM-DD HH:mm');

        if (this.data.toDate === 'Invalid date' || this.data.fromDate === 'Invalid date') {
            this.data.dateSearchField = null;
            this.data.fromDate = null;
            this.data.toDate = null;
        }

        if (!isEqual(tmpData, this.data)) {
            this.changedSubject.next();
        }
    }

    applyState(state: ClrDatagridStateInterface) {
        const tmpData = { ...this.data };
        const fieldMap = {
            orderRef: 'orderId',
            investor: 'investorWalletID',
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
        };

        this.data.sortByField = get(fieldMap, get(state, 'sort.by'), this.data.sortByField);
        this.data.sortOrder = get(state, 'sort.reverse', false) ? 'desc' : 'asc';
        this.data.rowOffSet = get(state, 'page.from', 0) / this.data.pageSize;

        if (!isEqual(tmpData, this.data)) {
            this.changedSubject.next();
        }
    }

    get() {
        return this.data;
    }

    get changed() {
        return this.changedSubject.asObservable();
    }
}
