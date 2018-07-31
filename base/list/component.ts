import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

import { FileDownloader } from '@setl/utils';
import { AccountAdminBaseService } from '../service';

@Component({
    selector: 'app-account-admin-list-base',
    template: '',
})
export class AccountAdminListBase implements OnInit, OnDestroy {

    noun: string;

    private token: string;
    private userId: number;
    private username: string;
    protected csvRequest;
    protected subscriptions: Subscription[] = [];

    @select(['user', 'authentication', 'token']) tokenOb;
    @select(['user', 'myDetail', 'userId']) userIdOb;
    @select(['user', 'myDetail', 'username']) userNameOb;

    /**
     *
     * This is a base class from which both teams and users classes inherit functionality.
     * This method is used so to stop replication of common code between the two components.
     * https://medium.com/@amcdnl/inheritance-in-angular2-components-206a167fc259
     */
    constructor(private router: Router,
                protected redux: NgRedux<any>,
                private fileDownloader: FileDownloader,
                private baseService: AccountAdminBaseService) {}

    ngOnInit() {
        this.initSubscriptions();
    }

    private initSubscriptions(): void {
        this.subscriptions.push(this.tokenOb.subscribe((token: string) => {
            this.token = token;
        }));

        this.subscriptions.push(this.userIdOb.subscribe((userId: number) => {
            this.userId = userId;
        }));

        this.subscriptions.push(this.userNameOb.subscribe((username: string) => {
            this.username = username;
        }));
    }

    navigateToEntity(entityId: number) {
        this.router.navigateByUrl(`/account-admin/${this.noun.toLowerCase()}s/${entityId}`);
    }

    exportEntitiesAsCSV(): void {
        this.baseService.getCSVExport(
            this.fileDownloader,
            this.csvRequest,
            `export${this.noun}sCSV`,
            this.token,
            this.userId,
            this.username,
            this.noun,
        );
    }

    ngOnDestroy() {
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach((sub: Subscription) => {
                sub.unsubscribe();
            });
        }

        this.subscriptions = [];
    }
}
