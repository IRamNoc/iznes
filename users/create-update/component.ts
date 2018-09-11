import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService } from '@setl/utils';
import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';

import {
    setRequestedUserTypes,
    clearRequestedUserTypes,
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
    createUserTooltip: TooltipConfig;
    createInviteUserTooltip: TooltipConfig;
    teamMembershipsTooltip: TooltipConfig;
    userPermissionsTooltip: TooltipConfig;
    forms: Model.AccountAdminUserForm[] = [];
    myDetails;
    siteSettings;
    usersPanelOpen: boolean = true;
    userTypes;

    private user: Model.AccountAdminUser;
    private userTeamsSelected: TeamModel.AccountAdminTeam[];

    @select(['userAdmin', 'userTypes', 'userTypes']) userTypesOb;
    @select(['userAdmin', 'userTypes', 'requested']) userTypesReqOb;
    @select(['user', 'myDetail']) myDetailsOb;
    @select(['user', 'siteSettings']) siteSettingsOb;

    constructor(private service: UsersService,
                private redux: NgRedux<any>,
                route: ActivatedRoute,
                protected router: Router,
                protected alerts: AlertsService,
                protected toaster: ToasterService,
                protected confirmations: ConfirmationService,
                protected translate: MultilingualService,
                private userMgmtService: UserManagementServiceBase) {
        super(route, router, alerts, toaster, confirmations, translate);
        this.noun = AccountAdminNouns.User;
    }

    ngOnInit() {
        super.ngOnInit();

        this.initUsersSubscriptions();
        this.initTooltips();
    }

    private initTooltips(): void {
        this.addAdditionalUserTooltip = {
            text: this.translate.translate(`If you add another user here, then the teams you assign below
                will apply to all those users.`),
            size: 'small',
        };

        this.userPermissionsTooltip = {
            text: this.translate.translate(`User permissions allow you view the effective
                permissions a user holds over multiple teams.`),
            size: 'small',
        };

        this.teamMembershipsTooltip = {
            text: this.translate.translate(`Add users to this team. Users will inherit
                the permissions outlined in User permissions.`),
            size: 'small',
        };
    }

    private initForm(userTypeId: string): void {
        this.form = this.generateForm(userTypeId);

        if (this.forms.length === 0) {
            this.forms.push(_.clone(this.form));
        }
    }

    private generateForm(userTypeId: string): Model.AccountAdminUserForm {
        const userType = _.filter(this.userTypes, (userType: any) => {
            return userType = userTypeId;
        });

        return new Model.AccountAdminUserForm(userType, this.userTypes);
    }

    private initUsersSubscriptions(): void {
        const myDetailsSub = this.myDetailsOb.subscribe((details) => {
            this.myDetails = details;

            this.requestUserTypes(false);
        });

        const userTypesSub = this.userTypesOb.subscribe((userTypes: any) => {
            if (userTypes !== undefined && userTypes.length > 0) {
                this.userTypes = this.processUserTypes(userTypes);

                this.requestUser();

                this.redux.dispatch(setRequestedUserTypes());
            }
        });

        const siteSettingsSub = this.siteSettingsOb.subscribe((settings) => {
            this.siteSettings = settings;
        });

        this.subscriptions.push(
            myDetailsSub,
            userTypesSub,
            siteSettingsSub,
        );
    }

    private requestUserTypes(requested: boolean): void {
        if (requested) return;

        this.service.getUserTypes();
    }

    private processUserTypes(userTypes: any[]): any[] {
        const items = [];

        _.forEach(userTypes, (userType: any) => {
            if (userType.typeID !== this.myDetails.userType) return;

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
            this.initForm(this.myDetails.userType);
        }
    }

    private onReadUserSuccess(data): void {
        const user: Model.AccountAdminUser = data[1].Data[0];
        this.user = user;

        this.initForm(user.userType);
        this.initCreateTooltip();

        this.form.firstName.preset = user.firstName;
        this.form.lastName.preset = user.lastName;
        this.form.emailAddress.preset = user.emailAddress;
        this.form.phoneNumber.preset = user.phoneNumber;
        this.form.reference.preset = user.reference;

        this.status = user.userStatus;

        this.form.emailAddress.disabled = true;
    }

    private initCreateTooltip(): void {
        this.createUserTooltip = {
            text: this.translate.translate(`Create a new user on the platform or you
                may also create and invite the user to use the platform`),
            size: 'small',
        };

        if (!this.user.invitationComplete) {
            this.createUserTooltip.text +=
                `<br /><br />Last invite: ${this.user.invitationDate} (${this.user.invitationEmail})`;
        }
    }

    getUserTeams(teams: TeamModel.AccountAdminTeam[]): void {
        this.userTeamsSelected = teams;
    }

    addAdditionalUser(): void {
        this.forms.push(this.generateForm(this.userTypes[0]));
    }

    removeUser(index: number): void {
        if (this.forms.length > 1) this.forms.splice(index, 1);
    }

    isValid(): boolean {
        return this.isFormValid() && this.isUserTeamsValid();
    }

    private isFormValid(): boolean {
        let valid: boolean = true;

        _.forEach(this.forms, (form: Model.AccountAdminUserForm) => {
            if (!form.isValid()) valid = false;

            return;
        });

        return valid;
    }

    private isUserTeamsValid(): boolean {
        if (!this.userTeamsSelected) return false;

        let valid = false;

        _.forEach(this.userTeamsSelected, (userTeam) => {
            if (userTeam.isActivated === true) valid = true;
        });

        return valid;
    }

    isUserInvitationComplete(): boolean {
        return (this.user) && this.user.invitationComplete === 1;
    }

    showNoTeamsMessage(): boolean {
        return this.isFormValid() && !this.isUserTeamsValid();
    }

    isUserStatusPending(): boolean {
        return (this.user) && this.user.userStatus === 0 &&
            !!this.user.invitationToken;
    }

    save(invite: boolean = false): void {
        if (this.isCreateMode()) {
            this.checkUserForNoTeams(() => this.createUsers(invite));
        } else if (this.isUpdateMode()) {
            this.checkUserForNoTeams(() => this.updateUser(invite));
        }
    }

    private checkUserForNoTeams(callback: () => void): void {
        const assignedTeams = _.find(this.userTeamsSelected, (team: TeamModel.AccountAdminTeam) => {
            return team.isActivated === true || (team.isActivated as any) === 1;
        });

        if (!assignedTeams) {
            this.confirmations.create(
                this.translate.translate('Are you sure?'),
                this.translate.translate(`You have assigned no teams to this user.
                    This user, will no longer hold any permissions on the system.`),
            ).subscribe((answer) => {
                if (answer.resolved) {
                    callback();
                }
            });
        } else {
            callback();
        }
    }

    private generateInviteList(): string {
        let invites: string = '';

        _.forEach(this.forms, (form: Model.AccountAdminUserForm, index: number) => {
            invites += `${form.emailAddress.value()}<br />`;
        });

        return invites;
    }

    private createUsers(invite: boolean): void {
        this.confirmations.create(this.alertCreateTitle, this.alertCreateMessage)
            .subscribe((res) => {
                if (res.resolved) {
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
                                this.doUserManagementUpdateOb.next(data[1].Data[0].userID);

                                this.onSaveSuccess(
                                    `${form.firstName.value()} ${form.lastName.value()}`,
                                    data[1].Data[0].userID,
                                    false,
                                );

                                _.forEach(this.forms, (form: Model.AccountAdminUserForm) => {
                                    if (invite) this.inviteUser(data[1].Data[0].userID, form, false);
                                });

                                if (this.forms.length === index + 1) {
                                    this.router.navigateByUrl(this.getBackUrl());
                                }
                            },
                            (e: AccountAdminErrorResponse) => this.onSaveError(
                                `${form.firstName.value()} ${form.lastName.value()}`,
                                e,
                            ),
                        );
                    });
                }
            });
    }

    private updateUser(invite: boolean): void {
        this.confirmations.create(this.alertUpdateTitle, this.alertUpdateMessage)
            .subscribe((res) => {
                if (res.resolved) {
                    this.service.updateUser(
                        this.entityId,
                        this.accountId,
                        this.form.firstName.value(),
                        this.form.lastName.value(),
                        this.form.emailAddress.value(),
                        this.form.phoneNumber.value(),
                        this.form.userType.value()[0].id,
                        this.form.reference.value(),
                        () => {
                            this.doUserManagementUpdateOb.next();

                            this.onSaveSuccess(
                                `${this.form.firstName.value()} ${this.form.lastName.value()}`,
                                this.entityId,
                            );

                            if (invite) this.inviteUser(this.entityId, this.form, false);
                        },
                        (e: AccountAdminErrorResponse) => this.onSaveError(
                            `${this.form.firstName.value()} ${this.form.lastName.value()}`,
                            e,
                        ),
                    );
                }
            });
    }

    private inviteUser(userId: number, form: Model.AccountAdminUserForm, showToaster: boolean = true): void {
        this.service.inviteUser(
            userId,
            form.firstName.value(),
            form.emailAddress.value(),
            this.siteSettings.language,
            this.myDetails.displayName ? this.myDetails.displayName : this.myDetails.username,
            () => this.onInviteSuccess(
                `${form.firstName.value()} ${form.lastName.value()}`,
                showToaster,
            ),
            () => this.onInviteError(
                `${form.firstName.value()} ${form.lastName.value()}`,
            ),
        );
    }

    private onInviteSuccess(userName: string, showToaster): void {
        if (showToaster) {
            const message = `${userName} successfully invited`;

            this.toaster.pop('success', message);

            this.router.navigateByUrl(this.getBackUrl());
        }
    }

    private onInviteError(userName: string): void {
        const message = `An error occured whilst inviting ${userName}`;

        this.toaster.pop('error', message);

        this.router.navigateByUrl(this.getBackUrl());
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

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
