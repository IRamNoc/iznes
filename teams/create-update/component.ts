import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService } from '@setl/utils';
import { ToasterService } from 'angular2-toaster';

import * as Model from '../model';
import * as UsersModel from '../../users/model';
import { AccountAdminPermission } from '../../base/create-update/permissions/model';
import { UserManagementServiceBase } from '../../base/create-update/user-management/service';
import { AccountAdminPermissionsServiceBase } from '../../base/create-update/permissions/service';
import { UserTeamsService } from '../service';
import { AccountAdminCreateUpdateBase } from '../../base/create-update/component';
import { AccountAdminErrorResponse, AccountAdminSuccessResponse, AccountAdminNouns } from '../../base/model';

@Component({
    selector: 'app-core-admin-teams-crud',
    templateUrl: 'component.html',
})
export class UserTeamsCreateUpdateComponent
    extends AccountAdminCreateUpdateBase<Model.AccountAdminTeamForm> implements OnInit, OnDestroy {

    form: Model.AccountAdminTeamForm = new Model.AccountAdminTeamForm();

    private usersSelected: UsersModel.AccountAdminUser[];
    private permissionsSelected: AccountAdminPermission[];

    constructor(private service: UserTeamsService,
                private userMgmtService: UserManagementServiceBase,
                private permissionsService: AccountAdminPermissionsServiceBase,
                route: ActivatedRoute,
                protected router: Router,
                alerts: AlertsService,
                toaster: ToasterService,
                confirmations: ConfirmationService) {
        super(route, router, alerts, toaster, confirmations);
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

    save(): void {
        if (this.isCreateMode()) {
            this.createTeam();
        } else if (this.isUpdateMode()) {
            this.updateTeam();
        }
    }

    protected onDeleteConfirm(): void {
        if (this.isUpdateMode()) this.deleteTeam();
    }

    private createTeam(): void {
        this.service.createUserTeam(
            this.accountId,
            this.form.name.value(),
            this.form.reference.value(),
            this.form.description.value(),
            (data: AccountAdminSuccessResponse) => {
                this.onSaveSuccess(
                    this.form.name.value(),
                    data[1].Data[0].userTeamID,
                );

                this.addUsersToTeam(
                    data[1].Data[0].userTeamID,
                    `${this.form.name}`,
                );

                this.addPermissionsToTeam(
                    data[1].Data[0].userTeamID,
                    `${this.form.name}`,
                );

                this.router.navigateByUrl(this.getBackUrl());
            },
            (e: AccountAdminErrorResponse) => this.onSaveError(this.form.name.value(), e),
        );
    }

    private addUsersToTeam(userTeamId: number, teamName: string): void {
        _.forEach(this.usersSelected, (user: UsersModel.AccountAdminUser) => {
            this.userMgmtService.updateTeamUserMap(
                user.isActivated ? true : false,
                user.userID,
                userTeamId,
                () => {},
                (e: AccountAdminErrorResponse) => this.onSaveError(
                    teamName,
                    e,
                ),
            );
        });
    }

    private addPermissionsToTeam(userTeamId: number, teamName: string): void {
        _.forEach(this.permissionsSelected, (permission: AccountAdminPermission) => {
            // only update child permissions && permissions that are ticked as true
            if (permission.parentID !== null && permission.state) {
                this.permissionsService.updateTeamPermission(
                    permission.state,
                    userTeamId,
                    permission.permissionAreaID,
                    () => {},
                    (e: AccountAdminErrorResponse) => this.onSaveError(
                        teamName,
                        e,
                    ),
                );
            }
        });
    }

    private updateTeam(): void {
        this.service.updateUserTeam(
            this.entityId,
            this.form.name.value(),
            this.form.reference.value(),
            this.form.description.value(),
            () => this.onSaveSuccess(this.form.name.value(), this.entityId),
            (e: AccountAdminErrorResponse) => this.onSaveError(this.form.name.value(), e),
        );
    }

    private deleteTeam(): void {
        this.service.deleteUserTeam(
            this.entityId,
            () => this.onDeleteSuccess(this.form.name.value()),
            (e: AccountAdminErrorResponse) => this.onDeleteError(this.form.name.value(), e),
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
