import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';

import * as Model from '../model';
import { UsersService } from '../service';
import { AccountAdminCreateUpdateBase } from '../../base/create-update/component';
import { AccountAdminErrorResponse } from '../../base/model';

@Component({
    selector: 'app-core-admin-users-crud',
    templateUrl: '../../base/create-update/component.html',
})
export class UsersCreateUpdateComponent extends AccountAdminCreateUpdateBase implements OnInit, OnDestroy {

    form: Model.AccountAdminUserForm = new Model.AccountAdminUserForm();

    constructor(private service: UsersService,
                route: ActivatedRoute,
                router: Router,
                alerts: AlertsService,
                toaster: ToasterService) {
        super(route, router, alerts, toaster);
        this.noun = 'User';
    }

    ngOnInit() {
        super.ngOnInit();

        if (this.isUpdateMode()) {
            this.service.readUsers(this.entityId,
                                   null,
                                   (data: any) => this.onReadUserSuccess(data),
                                   (e: any) => this.onReadEntityError(e));
        }
    }

    private onReadUserSuccess(data): void {
        const user: Model.AccountAdminUser = data[1].Data[0];

        this.form.firstName.control.setValue(user.firstName);
        this.form.lastName.control.setValue(user.lastName);
        this.form.emailAddress.control.setValue(user.emailAddress);
        this.form.phoneNumber.control.setValue(user.phoneNumber);
        this.form.userType.control.setValue(user.userTypeID);
        this.form.reference.control.setValue(user.reference);
    }

    save(): void {
        if (this.isCreateMode()) {
            this.createUser();
        } else if (this.isUpdateMode()) {
            this.updateUser();
        }
    }

    private createUser(): void {
        this.service.createUser(
            this.accountId,
            this.form.firstName.value(),
            this.form.lastName.value(),
            this.form.emailAddress.value(),
            this.form.phoneNumber.value(),
            this.form.userType.value(),
            this.form.reference.value(),
            () => this.onSaveSuccess(`${this.form.firstName.value()} ${this.form.lastName.value()}`),
            (e: AccountAdminErrorResponse) => this.onSaveError(
                `${this.form.firstName.value()} ${this.form.lastName.value()}`,
                e,
            ),
        );
    }

    private updateUser(): void {
        this.service.updateUser(
            this.entityId,
            this.accountId,
            this.form.firstName.value(),
            this.form.lastName.value(),
            this.form.emailAddress.value(),
            this.form.phoneNumber.value(),
            this.form.userType.value(),
            this.form.reference.value(),
            () => this.onSaveSuccess(`${this.form.firstName.value()} ${this.form.lastName.value()}`),
            (e: AccountAdminErrorResponse) => this.onSaveError(
                `${this.form.firstName.value()} ${this.form.lastName.value()}`,
                e,
            ),
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
