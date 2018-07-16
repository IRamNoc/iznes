import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService } from '@setl/utils';
import { ToasterService } from 'angular2-toaster';

import {
    setRequestedUserTypes,
} from '@setl/core-store';
import * as Model from '../model';
import { UsersService } from '../service';
import { AccountAdminCreateUpdateBase } from '../../base/create-update/component';
import { UserManagementServiceBase } from '../../base/create-update/user-management/service';
import * as TeamModel from '../../teams/model';
import {
    AccountAdminErrorResponse,
    AccountAdminSuccessResponse,
    AccountAdminNouns,
    TooltipConfig,
} from '../../base/model';

@Component({
    selector: 'app-core-admin-users-crud',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UsersCreateUpdateComponent
    extends AccountAdminCreateUpdateBase<Model.AccountAdminUserForm> implements OnInit, OnDestroy {

    addAdditionalUserTooltip: TooltipConfig;
    userPermissionsTooltip: TooltipConfig;
    teamMembershipsTooltip: TooltipConfig;
    forms: Model.AccountAdminUserForm[] = [];
    usersPanelOpen: boolean = true;
    userTypes;

    private userTeamsSelected: any[];

    @select(['userAdmin', 'userTypes', 'userTypes']) userTypesOb;
    @select(['userAdmin', 'userTypes', 'requested']) userTypesReqOb;

    constructor(private service: UsersService,
                private redux: NgRedux<any>,
                route: ActivatedRoute,
                protected router: Router,
                alerts: AlertsService,
                toaster: ToasterService,
                confirmations: ConfirmationService,
                private userMgmtService: UserManagementServiceBase) {
        super(route, router, alerts, toaster, confirmations);
        this.noun = AccountAdminNouns.User;
    }

    ngOnInit() {
        super.ngOnInit();

        this.initUsersSubscriptions();
        this.initTooltips();
    }

    private initTooltips(): void {
        this.addAdditionalUserTooltip = {
            text: `If you add another user here, then the teams you assign below
                will apply to all those users.`,
            size: 'small',
        };

        this.userPermissionsTooltip = {
            text: `User permissions allow you to set the rights that users will have over IZNES.
                You can assign permissions in two ways; either you can give permissions to a single
                user with the matrix below or you can create teams with specific permissions and add users to them.`,
            size: 'small',
        };

        this.teamMembershipsTooltip = {
            text: 'Add users to this team. Users will inherit the permissions outlined in User permissions.',
            size: 'small',
        };
    }

    private initForm(userTypeId: string): void {
        const userType = _.filter(this.userTypes, (userType: any) => {
            return userType = userTypeId;
        });

        this.form = this.generateForm(userTypeId);
        this.forms.push(_.clone(this.form));
    }

    private generateForm(userTypeId: string): Model.AccountAdminUserForm {
        const userType = _.filter(this.userTypes, (userType: any) => {
            return userType = userTypeId;
        });

        return new Model.AccountAdminUserForm(userType, this.userTypes);
    }

    private initUsersSubscriptions(): void {
        const userTypesSub = this.userTypesOb.subscribe((userTypes: any) => {
            if (userTypes !== undefined && userTypes.length > 0) {
                this.userTypes = this.processUserTypes(userTypes);

                this.requestUser();

                this.redux.dispatch(setRequestedUserTypes());
            }
        });

        const userTypesReqSub = this.userTypesReqOb.subscribe((requested: boolean) => {
            this.requestUserTypes(requested);
        });

        this.subscriptions.push(userTypesSub, userTypesReqSub);
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
                                   null,
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

        this.status = user.userStatus === 1 ? true : false;
    }

    getUserTeams(teams: any[]): void {
        this.userTeamsSelected = teams;
    }

    addAdditionalUser(): void {
        this.forms.push(this.generateForm(this.userTypes[0]));
    }

    removeUser(index: number): void {
        if (this.forms.length > 1) this.forms.splice(index, 1);
    }

    isValid(): boolean {
        let valid: boolean = true;

        _.forEach(this.forms, (form: Model.AccountAdminUserForm) => {
            if (!form.isValid()) valid = false;

            return;
        });

        return valid;
    }

    save(): void {
        if (this.isCreateMode()) {
            this.createUsers();
        } else if (this.isUpdateMode()) {
            this.updateUser();
        }
    }

    protected onDeleteConfirm(): void {
        this.service.deleteUser(
            this.entityId,
            () => this.onDeleteSuccess(
                `${this.form.firstName.value()} ${this.form.lastName.value()}`,
            ),
            (e: AccountAdminErrorResponse) => this.onDeleteError(
                `${this.form.firstName.value()} ${this.form.lastName.value()}`,
                e,
            ),
        );
    }

    private createUsers(): void {
        _.forEach(this.forms, (form: Model.AccountAdminUserForm, index: number) => {
            this.service.createUser(
                this.accountId,
                form.firstName.value(),
                form.lastName.value(),
                form.emailAddress.value(),
                form.phoneNumber.value(),
                form.userType.value()[0].id,
                form.reference.value(),
                (data: AccountAdminSuccessResponse) => {
                    this.onSaveSuccess(
                        `${form.firstName.value()} ${form.lastName.value()}`,
                        data[1].Data[0].userID,
                    );

                    this.addUserToTeams(
                        data[1].Data[0].userID,
                        `${form.firstName.value()} ${form.lastName.value()}`,
                    );

                    if (this.forms.length === index + 1) this.router.navigateByUrl(this.getBackUrl());
                },
                (e: AccountAdminErrorResponse) => this.onSaveError(
                    `${form.firstName.value()} ${form.lastName.value()}`,
                    e,
                ),
            );
        });
    }

    private addUserToTeams(userId: number, username: string): void {
        _.forEach(this.userTeamsSelected, (team: TeamModel.AccountAdminTeam) => {
            this.userMgmtService.updateTeamUserMap(
                team.isActivated,
                userId,
                team.userTeamID,
                () => {},
                (e: AccountAdminErrorResponse) => this.onSaveError(
                    username,
                    e,
                ),
            );
        });
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
            () => this.onSaveSuccess(
                `${this.form.firstName.value()} ${this.form.lastName.value()}`,
                this.entityId,
            ),
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
