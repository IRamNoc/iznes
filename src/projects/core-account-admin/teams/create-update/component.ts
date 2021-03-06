import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService } from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';
import * as Model from '../model';
import * as UsersModel from '../../users/model';
import { AccountAdminPermission } from '../../base/create-update/permissions/model';
import { UserTeamsService } from '../service';
import { AccountAdminCreateUpdateBase } from '../../base/create-update/component';
import { AccountAdminErrorResponse, AccountAdminSuccessResponse, AccountAdminNouns } from '../../base/model';
import { PermissionsService } from '@setl/utils/services/permissions';

@Component({
    selector: 'app-core-admin-teams-crud',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UserTeamsCreateUpdateComponent
    extends AccountAdminCreateUpdateBase<Model.AccountAdminTeamForm> implements OnInit, OnDestroy {

    form: Model.AccountAdminTeamForm = new Model.AccountAdminTeamForm();

    private usersSelected: UsersModel.AccountAdminUser[];
    private permissionsSelected: AccountAdminPermission[];

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

    constructor(private service: UserTeamsService,
                route: ActivatedRoute,
                protected router: Router,
                alerts: AlertsService,
                toaster: ToasterService,
                confirmations: ConfirmationService,
                public permissionsService: PermissionsService,
                protected translate: MultilingualService) {
        super(route, router, alerts, toaster, confirmations, translate);
        this.noun = AccountAdminNouns.Team;
    }

    ngOnInit() {
        super.ngOnInit();

        if (this.isUpdateMode()) {
            this.service.readUserTeams(this.entityId,
                                       null,
                                       (data: any) => this.onReadTeamSuccess(data),
                                       (e: any) => this.onReadEntityError());
        }

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
        if (type === 'teams') {
            if (!this.hasPermissionUpdateTeams &&
                !this.hasPermissionDeleteTeams &&
                !this.hasPermissionUpdatePermissions
            ) {
                return this.translate.translate(
                    // tslint:disable-next-line:max-line-length
                    'Please contact the administrator to request permission to update and delete teams, or to update team permissions.',
                );
            }

            if (!this.hasPermissionUpdateTeams && !this.hasPermissionDeleteTeams) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to update and delete teams.',
                );
            }

            if (!this.hasPermissionDeleteTeams && !this.hasPermissionUpdatePermissions) {
                return this.translate.translate(
                    // tslint:disable-next-line:max-line-length
                    'Please contact the administrator to request permission to delete teams, or to update team permissions.',
                );
            }

            if (!this.hasPermissionUpdateTeams && !this.hasPermissionUpdatePermissions) {
                return this.translate.translate(
                    // tslint:disable-next-line:max-line-length
                    'Please contact the administrator to request permission to update teams, or to update team permissions.',
                );
            }

            if (!this.hasPermissionUpdateTeams) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to update teams.',
                );
            }

            if (!this.hasPermissionDeleteTeams) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to delete teams.',
                );
            }

            if (!this.hasPermissionUpdatePermissions) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to update team permissions.',
                );
            }
        }

        if (type === 'users') {
            if (!this.hasPermissionCreateUsers && !this.hasPermissionUpdateMembership) {
                return this.translate.translate(
                    // tslint:disable-next-line:max-line-length
                    'Please contact the administrator to request permission to create users or to update user memberships.',
                );
            }

            if (!this.hasPermissionCreateUsers) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to create users.',
                );
            }

            if (!this.hasPermissionUpdateMembership) {
                return this.translate.translate(
                    'Please contact the administrator to request permission to update user memberships.',
                );
            }
        }
    }

    private onReadTeamSuccess(data): void {
        const team: Model.AccountAdminTeam = data[1].Data[0];

        this.form.description.control.setValue(team.description);
        this.form.name.control.setValue(team.name);
        this.form.reference.control.setValue(team.reference);

        this.status = team.status;
    }

    getTeamUsers(users: UsersModel.AccountAdminUser[]): void {
        this.usersSelected = users;
    }

    getTeamPermissions(permissions: AccountAdminPermission[]): void {
        this.permissionsSelected = permissions;
    }

    isValid(): boolean {
        return this.form.isValid();
    }

    isTeamDisabled(): boolean {
        return this.status === 0;
    }

    save(): void {
        if (this.isCreateMode() && this.hasPermissionCreateTeams) {
            this.checkUserForNoPermissions(() => this.createTeam());
        } else if (this.isUpdateMode() && this.hasPermissionUpdateTeams) {
            this.checkUserForNoPermissions(() => this.updateTeam());
        } else {
            this.alerts.create('error', 'Permission denied.');
        }
    }

    private checkUserForNoPermissions(callback: () => void): void {
        const assignedPermissions = _.find(this.permissionsSelected, (permission: AccountAdminPermission) => {
            return permission.state === true || (permission.state as any) === 1;
        });

        if (!assignedPermissions) {
            this.confirmations.create(
                this.translate.translate('Are you sure?'),
                this.translate.translate(`You have selected no permissions for this team.
                    Any users, solely assigned to this team, will no longer hold any permissions on the system.`),
            ).subscribe((answer) => {
                if (answer.resolved) {
                    callback();
                }
            });
        } else {
            callback();
        }
    }

    private createTeam(): void {
        this.confirmations.create(this.alertCreateTitle, this.alertCreateMessage)
            .subscribe((res) => {
                if (res.resolved) {
                    this.service.createUserTeam(
                        this.accountId,
                        this.form.name.value(),
                        this.form.reference.value(),
                        this.form.description.value(),
                        (data: AccountAdminSuccessResponse) => {
                            const teamId: number = data[1].Data[0].userTeamID;

                            this.doUserManagementUpdateOb.next(teamId);
                            this.doPermissionsUpdateOb.next(teamId);

                            this.onSaveSuccess(
                                this.form.name.value(),
                                data[1].Data[0].userTeamID,
                            );

                            this.router.navigateByUrl(this.getBackUrl());
                        },
                        (e: AccountAdminErrorResponse) => this.onSaveError(this.form.name.value(), e),
                    );
                }
            });
    }

    private updateTeam(): void {
        this.confirmations.create(this.alertUpdateTitle, this.alertUpdateMessage)
            .subscribe((res) => {
                if (res.resolved) {
                    this.service.updateUserTeam(
                        this.entityId,
                        this.form.name.value(),
                        this.form.reference.value(),
                        this.form.description.value(),
                        () => {
                            this.doUserManagementUpdateOb.next();
                            this.doPermissionsUpdateOb.next();

                            this.onSaveSuccess(
                                this.form.name.value(),
                                this.entityId,
                            );
                        },
                        (e: AccountAdminErrorResponse) => this.onSaveError(this.form.name.value(), e),
                    );
                }
            });
    }

    doDeleteTeam(): void {
        let str = `${this.form.name.value()}`;
        str = this.form.reference.value() ? `${str} - ${this.form.reference.value()}` : str;
        this.delete(str);
    }

    private deleteTeam(): void {
        this.service.deleteUserTeam(
            this.entityId,
            () => this.onDeleteSuccess(this.form.name.value()),
            (e: AccountAdminErrorResponse) => this.onDeleteError(this.form.name.value(), e),
        );
    }

    protected onDeleteConfirm(): void {
        if (this.isUpdateMode()) this.deleteTeam();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
