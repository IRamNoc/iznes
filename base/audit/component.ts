import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-account-admin-audit-base',
    template: '',
})
export class AccountAdminAuditBase implements OnInit, OnDestroy {

    audit;
    private subscriptions: Subscription[] = [];

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

    exportEntitiesAsCSV(): void {
        console.log('export as csv');
    }

    ngOnDestroy() {
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach((sub: Subscription) => {
                sub.unsubscribe();
            });
        }
    }
}
