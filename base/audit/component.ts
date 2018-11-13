import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { MultilingualService } from '@setl/multilingual';
import { FileDownloader } from '@setl/utils';
import { AccountAdminBaseService } from '../service';
import { DataGridConfig } from '../../base/model';

@Component({
    selector: 'app-account-admin-audit-base',
    template: '',
})
export class AccountAdminAuditBase<Type> implements OnInit, OnDestroy {
    audit: Type[];
    dateConfig = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null,
    };
    datagridConfig: DataGridConfig;
    noun: string;
    searchForm: FormGroup;
    protected subscriptions: Subscription[] = [];

    protected token: string; // this is only needed for CSV exports
    protected userId: number; // this is only needed for CSV exports
    protected username: string; // this is only needed for CSV exports
    protected csvRequest; // this is only needed for CSV exports

    @select(['user', 'authentication', 'token']) tokenOb;
    @select(['user', 'myDetail', 'userId']) userIdOb;
    @select(['user', 'myDetail', 'username']) userNameOb;

    /**
     *
     * This is a base class from which both teams and users classes inherit functionality.
     * This method is used so to stop replication of common code between the two components.
     * https://medium.com/@amcdnl/inheritance-in-angular2-components-206a167fc259
     */
    constructor(protected redux: NgRedux<any>,
                public translate: MultilingualService,
                protected fileDownloader: FileDownloader,
                protected baseService: AccountAdminBaseService,
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.initDataGridConfig();
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

    protected initDataGridConfig(): void {
        console.error('method not implemented');
    }

    private initForm(): void {
        this.searchForm = new FormGroup({
            entitySearch: new FormControl(''),
            dateFrom: new FormControl(moment().add('-1', 'month').format('YYYY-MM-DD')),
            dateTo: new FormControl(moment().format('YYYY-MM-DD')),
        });

        this.searchForm.valueChanges.subscribe(() => {
            this.updateData();
        });

        this.csvRequest = {
            search: this.searchForm.value.entitySearch,
            dateFrom: moment(this.searchForm.value.dateFrom).format('YYYY-MM-DD 00:00:00'),
            dateTo: moment(this.searchForm.value.dateTo).format('YYYY-MM-DD 23:59:59'),
            isCSVRequest: true,
        };
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
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach((sub: Subscription) => {
                sub.unsubscribe();
            });
        }

        this.subscriptions = [];
        this.audit = undefined;
    }
}
