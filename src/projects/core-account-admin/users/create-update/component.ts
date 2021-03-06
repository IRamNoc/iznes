import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService } from '@setl/utils';
import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';
import { PermissionsService } from '@setl/utils/services/permissions';

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

    alertCreateNoActiveTitle: string;
    alertCreateNoActiveMessage: string;
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
    showTooltips: boolean = true;

    private user: Model.AccountAdminUser;
    private userTeamsSelected: TeamModel.AccountAdminTeam[];
    private userHasActiveTeam: () => boolean;

    public hasPermissionViewTeams: boolean;
    public hasPermissionCreateTeams: boolean;
    public hasPermissionUpdateTeams: boolean;
    public hasPermissionDeleteTeams: boolean;
    public hasPermissionViewUsers: boolean;
    public hasPermissionCreateUsers: boolean;
    public hasPermissionUpdateUsers: boolean;
    public hasPermissionDeleteUsers: boolean;
    public hasPermissionUpdateMembership: boolean;
    public hasPermissionUpdatePermissions: boolean;

    @select(['user', 'siteSettings', 'language']) requestLanguageOb;
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
                public permissionsService: PermissionsService,
                private changeDetectorRef: ChangeDetectorRef,
                private userMgmtService: UserManagementServiceBase) {
        super(route, router, alerts, toaster, confirmations, translate);
        this.noun = AccountAdminNouns.User;
    }

    ngOnInit() {
        super.ngOnInit();

        this.initUsersSubscriptions();
        this.initTooltips();
        this.initTranslations();

        this.permissionsService.hasPermission('accountAdminTeams', 'canRead').then(
            (hasPermission) => {
                this.hasPermissionViewTeams = hasPermission;
            });

        this.permissionsService.hasPermission('accountAdminTeams', 'canInsert').then(
            (hasPermission) => {
                this.hasPermissionCreateTeams = hasPermission;
            });

        this.permissionsService.hasPermission('accountAdminTeams', 'canUpdate').then(
            (hasPermission) => {
                this.hasPermissionUpdateTeams = hasPermission;
            });

        this.permissionsService.hasPermission('accountAdminTeams', 'canDelete').then(
            (hasPermission) => {
                this.hasPermissionDeleteTeams = hasPermission;
            });

        this.permissionsService.hasPermission('accountAdminUsers', 'canRead').then(
            (hasPermission) => {
                this.hasPermissionViewUsers = hasPermission;
            });

        this.permissionsService.hasPermission('accountAdminUsers', 'canInsert').then(
            (hasPermission) => {
                this.hasPermissionCreateUsers = hasPermission;
            });

        this.permissionsService.hasPermission('accountAdminUsers', 'canUpdate').then(
            (hasPermission) => {
                this.hasPermissionUpdateUsers = hasPermission;
            });

        this.permissionsService.hasPermission('accountAdminUsers', 'canDelete').then(
            (hasPermission) => {
                this.hasPermissionDeleteUsers = hasPermission;
            });

        this.permissionsService.hasPermission('accountAdminManageMembership', 'canUpdate').then(
            (hasPermission) => {
                this.hasPermissionUpdateMembership = hasPermission;
            });

        this.permissionsService.hasPermission('accountAdminManagePermission', 'canUpdate').then(
            (hasPermission) => {
                this.hasPermissionUpdatePermissions = hasPermission;
            });
    }

    /**
     * Return missing permissions message
     *
     * @returns {string}
     */
    public getPermissionMessage(type): string {
        if (type === 'users') {
            if (!this.hasPermissionUpdateUsers &&
                !this.hasPermissionDeleteUsers &&
                !this.hasPermissionUpdatePermissions
            ) {
                return this.translate.translate(
                    // tslint:disable-next-line:max-line-length
                    'Please contact the administrator to request permission to update and delete users or to update user permissions.',
                );
            }

            if (!this.hasPermissionUpdateUsers && !this.hasPermissionDeleteUsers) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to update and delete users.',
                );
            }

            if (!this.hasPermissionUpdateUsers && !this.hasPermissionUpdatePermissions) {
                return this.translate.translate(
                    // tslint:disable-next-line:max-line-length
                    'Please contact the administrator to request permission to update users or to update user permissions.',
                );
            }

            if (!this.hasPermissionDeleteUsers && !this.hasPermissionUpdatePermissions) {
                return this.translate.translate(
                    // tslint:disable-next-line:max-line-length
                    'Please contact the administrator to request permission to delete users or to update user permissions.',
                );
            }

            if (!this.hasPermissionDeleteUsers) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to delete users.',
                );
            }

            if (!this.hasPermissionUpdateUsers) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to update users.',
                );
            }

            if (!this.hasPermissionUpdatePermissions) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to update user permissions.',
                );
            }
        }

        if (type === 'teams') {
            if (!this.hasPermissionCreateTeams &&
                !this.hasPermissionUpdateMembership &&
                !this.hasPermissionUpdateUsers
            ) {
                return this.translate.translate(
                    // tslint:disable-next-line:max-line-length
                    'Please contact the administrator to request permission to create or update teams, or to update team memberships.',
                );
            }

            if (!this.hasPermissionUpdateMembership && !this.hasPermissionUpdateUsers) {
                return this.translate.translate(
                    // tslint:disable-next-line:max-line-length
                    'Please contact the administrator to request permission to update teams or to update team memberships.',
                );
            }

            if (!this.hasPermissionCreateTeams && !this.hasPermissionUpdateUsers) {
                return this.translate.translate(
                    // tslint:disable-next-line:max-line-length
                    'Please contact the administrator to request permission to create or update teams.',
                );
            }

            if (!this.hasPermissionCreateTeams && !this.hasPermissionUpdateMembership) {
                return this.translate.translate(
                    // tslint:disable-next-line:max-line-length
                    'Please contact the administrator to request permission to create teams or to update team memberships.',
                );
            }

            if (!this.hasPermissionCreateTeams) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to create teams.',
                );
            }

            if (!this.hasPermissionUpdateUsers) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to update teams.',
                );
            }

            if (!this.hasPermissionUpdateMembership) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to update team memberships.',
                );
            }
        }
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

        this.changeDetectorRef.detectChanges();
        this.showTooltips = true;
    }

    private initTranslations(): void {
        this.alertCreateNoActiveTitle = this.translate.translate('Are you sure?');
        this.alertCreateNoActiveMessage =
            this.translate.translate(`You have not selected an active Team to assign this user(s) to.
                If you continue, this user(s) will not have any permissions.`);
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

        const languageSub = this.requestLanguageOb.subscribe(() => {
            this.showTooltips = false;
            this.initTooltips();
        });

        this.subscriptions.push(
            myDetailsSub,
            userTypesSub,
            siteSettingsSub,
            languageSub,
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
                '<br /><br />';
            this.createUserTooltip.text +=
                this.translate.translate(
                    'Last invite @invitationDate@ (@invitationEmail@)',
                    { 'invitationDate': this.user.invitationDate, 'invitationEmail': this.user.invitationEmail });
        }
    }

    getUserTeams(teams: TeamModel.AccountAdminTeam[]): void {
        this.userTeamsSelected = teams;
    }

    noActiveEntities(fn: () => boolean): void {
        this.userHasActiveTeam = fn;
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
        return (this.user) && this.user.userStatus === 2;
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
                    This user will no longer hold any permissions on the system.`),
            ).subscribe((answer) => {
                if (answer.resolved) {
                    callback();
                }
            });
        } else {
            callback();
        }
    }

    private createUsers(invite: boolean): void {
        if (!this.userHasActiveTeam()) {
            this.confirmations.create(this.alertCreateNoActiveTitle, this.alertCreateNoActiveMessage)
                .subscribe((res) => {
                    if (res.resolved) {
                        this.doCreateUsers(invite);
                    }
                });
        } else {
            this.doCreateUsers(invite);
        }
    }

    private doCreateUsers(invite: boolean): void {
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
                                this.onCreateUserSuccess(data, form, invite, index);
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

    private onCreateUserSuccess(data: AccountAdminSuccessResponse,
                                form: Model.AccountAdminUserForm,
                                invite: boolean,
                                index: number): void {
        this.doUserManagementUpdateOb.next(data[1].Data[0].userID);

        this.onSaveSuccess(
            `${form.firstName.value()} ${form.lastName.value()}`,
            data[1].Data[0].userID,
            false,
        );

        if (invite) this.inviteUser(data[1].Data[0].userID, form, false);

        if (this.forms.length === index + 1) {
            this.router.navigateByUrl(this.getBackUrl());
        }
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
            const message = this.translate.translate(
                '@userName@ successfully invited', { 'userName': userName });

            this.toaster.pop('success', message);

            this.router.navigateByUrl(this.getBackUrl());
        }
    }

    private onInviteError(userName: string): void {
        const message = this.translate.translate(
            'An error occured whilst inviting @userName@', { 'userName': userName });

        this.toaster.pop('error', message);

        this.router.navigateByUrl(this.getBackUrl());
    }

    doDeleteTeam(): void {
        let str = `${this.user.emailAddress}`;
        str = this.user.reference ? `${str} - ${this.user.reference}` : str;
        this.delete(str);
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

        /* Unsubscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }

        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();
    }
}
