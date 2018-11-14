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

    protected token: string; // this is only needed for CSV exports
    protected userId: number; // this is only needed for CSV exports
    protected username: string; // this is only needed for CSV exports
    protected csvRequest; // this is only needed for CSV exports
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
                protected fileDownloader: FileDownloader,
                protected baseService: AccountAdminBaseService,
    ) {
    }

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

    exportCSV(): void {
        this.exportEntitiesAsCSV();
    }

    protected exportEntitiesAsCSV(): void {
        console.error('method not implemented');
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
