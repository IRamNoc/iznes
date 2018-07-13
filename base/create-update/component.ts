import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService } from '@setl/utils';
import { ToasterService } from 'angular2-toaster';

import { AccountAdminErrorResponse, AccountAdminNouns } from '../model';

@Component({
    selector: 'app-account-admin-crud-base',
    template: 'component.html',
    styles: ['.row.actions .btn { margin-right: 0; }'],
})
export class AccountAdminCreateUpdateBase<Type> implements OnInit, OnDestroy {

    entityId: number;
    form;
    mode: 0 | 1; // 0 - create, 1 - update
    noun: string;
    permissionAreas: any[] = [];
    permissionLevels: any[] = [];
    permissionsEmitter: EventEmitter<any> = new EventEmitter();
    permissionsForm: FormGroup;

    protected accountId: number;
    protected subscriptions: Subscription[] = [];

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
                protected router: Router,
                private alerts: AlertsService,
                private toaster: ToasterService,
                private confirmations: ConfirmationService) {}

    ngOnInit() {
        this.processParams();
        this.initSubscriptions();
        this.initPermissions();
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

    private initPermissions(): void {
        this.permissionsForm = new FormGroup({
            permissions: new FormControl(),
        });
    }

    isTeamsPage(): boolean {
        return this.noun === AccountAdminNouns.Team;
    }

    isUsersPage(): boolean {
        return this.noun === AccountAdminNouns.User;
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

    private getUpdateUrl(id): string {
        return `/account-admin/${this.noun.toLowerCase()}s/${id}`;
    }

    save(): void {
        console.error('Method not implemented');
    }

    protected onSaveSuccess(entityName: string, entityId: number): void {
        let message = `${entityName} successfully `;

        if (this.isCreateMode()) {
            message += 'created';
        } else if (this.isUpdateMode()) {
            message += 'updated';
        }

        this.toaster.pop('success', message);
    }

    protected onSaveError(entityName: string, error: AccountAdminErrorResponse): void {
        let message = `${entityName} failed to be `;

        if (this.isCreateMode()) {
            message += 'created';
        } else if (this.isUpdateMode()) {
            message += 'updated';
        }

        message += `.<br /><i>${error[1].Data[0].Message}</i>`;

        this.alerts.create('error', message);
    }

    delete(): void {
        this.confirmations.create(
            `Delete ${this.noun}`,
            `Are you sure you wish to delete this ${this.noun.toLowerCase()}?`,
        ).subscribe((value) => {
            if (value.resolved) {
                this.onDeleteConfirm();
                return;
            }
        });
    }

    protected onDeleteConfirm(): void {
        console.error('Method not implemented');
    }

    protected onDeleteSuccess(entityName: string): void {
        const message = `${entityName} successfully deleted`;

        this.toaster.pop('success', message);

        this.router.navigateByUrl(this.getBackUrl());
    }

    protected onDeleteError(entityName: string, error: AccountAdminErrorResponse): void {
        const message = `${entityName} failed to delete` +
            `.<br /><i>${error[1].Data[0].Message}</i>`;

        this.alerts.create('error', message);
    }

    protected onReadEntityError(): void {
        this.toaster.pop('error', `Failed to read ${this.noun}`);

        this.router.navigateByUrl(this.getBackUrl());
    }

    ngOnDestroy() {
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach((sub: Subscription) => {
                sub.unsubscribe();
            });
        }
    }
}
