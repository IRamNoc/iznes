import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { ofiManageOrderActions } from '../../ofi-store';
import { Observable } from 'rxjs';
import { IFilterStore } from './search-filters';

@Injectable()
export class ManageOrdersService implements IFilterStore {

    constructor(private redux: NgRedux<any>) { }

    setOrderListPage(page: number) {
        this.redux.dispatch(ofiManageOrderActions.setCurrentPage(page));
    }

    resetOrderList() {
        this.redux.dispatch(ofiManageOrderActions.setCurrentPage(1));
        this.redux.dispatch(ofiManageOrderActions.resetTotalResults());
        this.redux.dispatch(ofiManageOrderActions.ofiClearOrdersFilters());
    }

    setTotalResults(results: number) {
        this.redux.dispatch(ofiManageOrderActions.setTotalResults(results));
    }

    incrementTotalResults() {
        this.redux.dispatch(ofiManageOrderActions.incrementTotalResults());
    }

    getFilters(): Observable<object> {
        return this.redux.select(['ofi', 'ofiOrders', 'manageOrders', 'filters']);
    }

    setFilters(filters: object) {
        this.redux.dispatch({
            type: ofiManageOrderActions.OFI_SET_ORDERS_FILTERS,
            filters,
        });
    }

    resetFilters() {
        this.setFilters({});
    }
}
