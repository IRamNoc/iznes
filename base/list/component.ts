import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

import { FileDownloader } from '@setl/utils';

@Component({
    selector: 'app-account-admin-list-base',
})
export class AccountAdminListBase implements OnInit, OnDestroy {

    noun: string;

    private token: string;
    private subscriptions: Subscription[];

    @select(['user', 'authentication', 'token']) tokenOb;

    /**
     *
     * This is a base class from which both teams and users classes inherit functionality.
     * This method is used so to stop replication of common code between the two components.
     * https://medium.com/@amcdnl/inheritance-in-angular2-components-206a167fc259
     */
    constructor(private router: Router,
                private redux: NgRedux<any>,
                private fileDownloader: FileDownloader) {}

    ngOnInit() {
        this.initSubscriptions();
    }

    private initSubscriptions(): void {
        this.subscriptions.push(this.tokenOb.subscribe((token: string) => {
            this.token = token;
        }));
    }

    navigateToEntity(entityId: number) {
        this.router.navigateByUrl(`/account-admin/${this.noun.toLowerCase()}s/${entityId}`);
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
