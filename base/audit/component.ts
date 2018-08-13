import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-account-admin-audit-base',
})
export class AccountAdminAuditBase implements OnInit, OnDestroy {

    private subscriptions: Subscription[];

    /**
     *
     * This is a base class from which both teams and users classes inherit functionality.
     * This method is used so to stop replication of common code between the two components.
     * https://medium.com/@amcdnl/inheritance-in-angular2-components-206a167fc259
     */
    constructor(private redux: NgRedux<any>) {}

    ngOnInit() {
        this.initSubscriptions();
    }

    private initSubscriptions(): void {
        //
    }

    protected updateData(): void {
        console.error('Method not implemented');
    }

    protected getSearchRequest(entityIdField: string): any {
        return {
            search: this.searchForm.value.entitySearch,
            dateFrom: moment(this.searchForm.value.dateFrom).format('YYYY-MM-DD 00:00:00'),
            dateTo: moment(this.searchForm.value.dateTo).format('YYYY-MM-DD 23:59:59'),
        };
    }

    goBackURL() {
        return `/account-admin/${this.noun.toLowerCase()}s`;
    }

    exportCSV(): void {
        this.exportEntitiesAsCSV();
    }

    protected exportEntitiesAsCSV(): void {
        console.error('method not implemented');
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }
}
