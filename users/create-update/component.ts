import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';

import { clearRequestedUserTypes } from '@setl/core-store';
import * as Model from '../model';
import { UsersService } from '../service';
import { AccountAdminCreateUpdateBase } from '../../base/create-update/component';
import { AccountAdminErrorResponse, AccountAdminNouns } from '../../base/model';

@Component({
    selector: 'app-core-admin-users-crud',
    templateUrl: '../../base/create-update/component.html',
})
export class UsersCreateUpdateComponent extends AccountAdminCreateUpdateBase implements OnInit, OnDestroy {

    form: Model.AccountAdminUserForm;
    userTypes;

    @select(['userAdmin', 'userTypes', 'userTypes']) userTypesOb;
    @select(['userAdmin', 'userTypes', 'requested']) userTypesReqOb;

    constructor(private service: UsersService,
                private redux: NgRedux<any>,
                route: ActivatedRoute,
                router: Router,
                alerts: AlertsService,
                toaster: ToasterService) {
        super(route, router, alerts, toaster);
        this.noun = AccountAdminNouns.User;
    }

    ngOnInit() {
        super.ngOnInit();

        this.initUserTypesSubscriptions();
    }

    private initForm(userTypeId: string): void {
        const userType = _.filter(this.userTypes, (userType: any) => {
            return userType = userTypeId;
        });

        this.form = new Model.AccountAdminUserForm(userType, this.userTypes);
    }

    private initUserTypesSubscriptions(): void {
        const userTypesSub = this.userTypesOb.subscribe((userTypes: any) => {
            if (userTypes !== undefined) {
                this.userTypes = this.processUserTypes(userTypes);

                this.requestUser();
            }
        });

        const userTypesReqSub = this.userTypesReqOb.subscribe((requested: boolean) => {
            this.requestUserTypes(requested);
        });

        this.subscriptions.push(userTypesSub, userTypesReqSub);

        this.redux.dispatch(clearRequestedUserTypes());
    }

    private requestUserTypes(requested: boolean): void {
        if (requested) return;

        this.service.getUserTypes();
    }

    private processUserTypes(userTypes: any[]): any[] {
        const items = [];

        _.forEach(userTypes, (userType: any) => {
            items.push({
                id: userType.typeID,
                text: userType.type,
            });
        });

        return items;
    }

    private requestUser(): void {
        if (this.isUpdateMode()) {
            this.service.readUsers(this.entityId,
                                   this.accountId,
                                   (data: any) => this.onReadUserSuccess(data),
                                   (e: any) => this.onReadEntityError());
        } else {
            this.initForm(this.userTypes[0]);
        }
    }

    private onReadUserSuccess(data): void {
        const user: Model.AccountAdminUser = data[1].Data[0];

        this.initForm(user.userType);

        this.form.firstName.preset = user.firstName;
        this.form.lastName.preset = user.lastName;
        this.form.emailAddress.preset = user.emailAddress;
        this.form.phoneNumber.preset = user.phoneNumber;
        this.form.reference.preset = user.reference;
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
            this.form.userType.value()[0].id,
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
            this.form.userType.value()[0].id,
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
