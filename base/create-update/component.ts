import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService } from '@setl/utils';
import { ToasterService } from 'angular2-toaster';

@Component({
    selector: 'app-account-admin-crud-base',
    templateUrl: 'component.html',
})
export class AccountAdminCreateUpdateBase implements OnInit, OnDestroy {

    entityId: number;
    form;
    mode: 0 | 1; // 0 - create, 1 - update
    noun: string;

    protected accountId: number;
    private subscriptions: Subscription[] = [];

    @select(['user', 'myDetail', 'accountId']) accountIdOb;

    /**
     *
     * This is a base class from which both teams and users classes inherit functionality.
     * This method is used so to stop replication of common code between the two components.
     * https://medium.com/@amcdnl/inheritance-in-angular2-components-206a167fc259
     *
     * @param route ActivatedRoute
     */
    constructor(private route: ActivatedRoute,
                private redux: NgRedux<any>,
                private alerts: AlertsService,
                private toaster: ToasterService,
                private confirmationService: ConfirmationService) {}

    ngOnInit() {
        this.processParams();
        this.initSubscriptions();
    }

    private processParams(): void {
        this.route.paramMap.subscribe((params) => {
            this.entityId = parseInt(params.get('id'), undefined);

            if (this.entityId) {
                this.mode = 1;
                return;
            }

            this.mode = 0;
        });
    }

    private initSubscriptions(): void {
        this.subscriptions.push(this.accountIdOb.subscribe((accountId: number) => {
            this.accountId = accountId;
        }));
    }

    isCreateMode(): boolean {
        return this.mode === 0;
    }

    isUpdateMode(): boolean {
        return this.mode === 1;
    }

    getBackUrl(): string {
        return `/account-admin/${this.noun.toLowerCase()}s`;
    }

    save(): void {
        console.error('Method not implemented');
    }

    protected onSaveSuccess(entityName: string): void {
        let message = `${entityName} successfully `;

        if (this.isCreateMode()) {
            message += 'created';
        } else if (this.isUpdateMode()) {
            message += 'updated';
        }

        this.toaster.pop('success', message);
    }

    protected onSaveError(entityName: string, error: string): void {
        let message = `${entityName} failed to be `;

        if (this.isCreateMode()) {
            message += 'created';
        } else if (this.isUpdateMode()) {
            message += 'updated';
        }

        message += `.<br /><i>${error}</i>`;

        this.alerts.create('error', message);
    }

    ngOnDestroy() {
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach((sub: Subscription) => {
                sub.unsubscribe();
            });
        }
    }
}
