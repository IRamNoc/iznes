import { DatagridParams } from '../datagrid-params';
import { SearchFilters, ISearchFilters } from '../search-filters';
import { FormBuilder } from '@angular/forms';
import { ClrDatagridStateInterface } from '@clr/angular';
import { of } from 'rxjs';

const mockFilters = {
    orderID: 110,
    fundname: 'myfund',
    sharename: 'myshare',
    isin: 'myisin',
    fromDate: '2018-08-20 00:00',
    toDate: '2018-08-21 00:00',
    status: [{ id: 3, text: 'Subscription' }],
    type: [{ id: 3, text: 'Waiting Settlement' }],
    dateType: [{ id: 'cutOffDate', text: 'Cut-off Date' }],
    assetManagementCompany: 'amComp',
    investorCompanyName: 'investor',
    portfolioLabel: 'portfolio',
};

class MockSearchFilters implements ISearchFilters {
    filters: {};

    constructor(filters = {}) {
        this.filters = { ...mockFilters, ...filters };
    }

    get() {
        return this.filters;
    }

    getForm() {
        const form = Object.keys(this.filters)
        .reduce(
            (a, k) => {
                a[k] = [this.filters[k]];
                return a;
            },
            {},
        );
        return (new FormBuilder()).group(form);
    }
}

describe('DatagridParams', () => {
    let fixture;
    beforeEach(() => {
        fixture = new DatagridParams(15);
    });
    it('Has the correct default params', () => {
        expect(fixture.get()).toEqual({
            fundName: null,
            shareName: null,
            isin: null,
            status: null,
            orderType: null,
            orderID: null,
            pageSize: 15,
            rowOffSet: 0,
            sortByField: 'orderId',
            sortOrder: 'desc',
            dateSearchField: null,
            fromDate: null,
            toDate: null,
            assetManagementCompany: null,
            investorCompanyName: null,
            portfolioLabel: null,
        });
    });
    it('Sets the params from search filters', () => {
        const searchFilters = new MockSearchFilters();
        fixture.setSearchFilters(searchFilters);

        const result = fixture.get();

        expect(result).toEqual({
            orderID: 110,
            fundName: 'myfund',
            shareName: 'myshare',
            isin: 'myisin',
            status: 3,
            orderType: 3,
            dateSearchField: 'cutOffDate',
            pageSize: 15,
            rowOffSet: 0,
            sortByField: 'orderId',
            sortOrder: 'desc',
            fromDate: '2018-08-20 00:00:00',
            toDate: '2018-08-21 23:59:59',
            assetManagementCompany: 'amComp',
            investorCompanyName: 'investor',
            portfolioLabel: 'portfolio',
        });
    });
    it('An invalid date blanks out all date related fields', () => {
        const searchFilters = new MockSearchFilters({ fromDate: 'INVALID' });
        fixture.setSearchFilters(searchFilters);

        const result = fixture.get();

        expect(result.dateSearchField).toBeNull();
        expect(result.fromDate).toBeNull();
        expect(result.toDate).toBeNull();
    });
    it('An order type of 0 results in null', () => {
        const searchFilters = new MockSearchFilters({ type: 0 });
        fixture.setSearchFilters(searchFilters);

        const result = fixture.get();

        expect(result.orderType).toBeNull();
    });
    describe('Changing of orderBy via state modifies params:', () => {
        it('reverse', () => {
            const state = <ClrDatagridStateInterface>{ sort: { reverse: false } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortOrder).toBe('asc');
        });
        it('isin', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'isin', reverse: false } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('isin');
        });
        it('orderRef', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'orderRef' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('orderId');
        });
        it('investor', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'investor' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('investorWalletID');
        });
        it('orderType', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'orderType' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('orderType');
        });
        it('fundName', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'fundName' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('fundName');
        });
        it('shareName', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'shareName' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('shareName');
        });
        it('shareCurrency', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'shareCurrency' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('currency');
        });
        it('quantity', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'quantity' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('quantity');
        });
        it('grossAmount', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'grossAmount' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('amountWithCost');
        });
        it('orderDate', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'orderDate' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('orderDate');
        });
        it('cutOffDate', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'cutOffDate' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('cutoffDate');
        });
        it('settlementDate', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'settlementDate' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('settlementDate');
        });
        it('orderStatus', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'orderStatus' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('orderStatus');
        });
        it('invalid does not alter', () => {
            const state = <ClrDatagridStateInterface>{ sort: { by: 'invalid' } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.sortByField).toBe('orderId');
        });
        it('page.from', () => {
            const state = <ClrDatagridStateInterface>{ page: { from: 30 } };

            fixture.applyState(state);

            const result = fixture.get();
            expect(result.rowOffSet).toBe(2);
        });
    });
    it('Emits when data changes', (done: DoneFn) => {
        const state = <ClrDatagridStateInterface>{ page: { from: 30 } };
        fixture.changed.subscribe(() => {
            expect(true).toBeTruthy();
            done();
        });

        fixture.applyState(state);
    });
});
