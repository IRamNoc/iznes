import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { ofiManageOrderActions } from '../../ofi-store';

@Injectable()
export class ManageOrdersService {

    constructor(private redux: NgRedux<any>) { }

    setOrderListPage(page: number) {
        this.redux.dispatch(ofiManageOrderActions.setCurrentPage(page));
    }

    resetOrderList() {
        this.redux.dispatch(ofiManageOrderActions.setCurrentPage(1));
        this.redux.dispatch(ofiManageOrderActions.resetTotalResults());
    }

    setTotalResults(results: number) {
        this.redux.dispatch(ofiManageOrderActions.setTotalResults(results));
    }

    incrementTotalResults() {
        this.redux.dispatch(ofiManageOrderActions.incrementTotalResults());
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
