import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { select, NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { MultilingualService } from '@setl/multilingual';

import {
    clearRequestedAccountAdminPermissionAreas,
    clearRequestedAccountAdminUserPermissionAreas,
} from '@setl/core-store';

import { AccountAdminPermissionsServiceBase } from './service';
import * as PermissionsModel from './model';
import * as TeamsModel from '../../../teams/model';
import { UserTeamsService } from '../../../teams/service';
import { immutableHelper, APP_CONFIG, AppConfig } from '@setl/utils';

@Component({
    selector: 'app-core-admin-permissions',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class AccountAdminPermissionsComponentBase implements OnInit, OnDestroy {
    @Input() doUpdateOb: Subject<number>;
    @Input() entityId: number;
    @Output() entitiesFn: EventEmitter<PermissionsModel.AccountAdminPermission[]> = new EventEmitter();
    @Input() isUser: boolean = false;
    @Input() showTeamSelect: boolean = true;

    appConfig: AppConfig;
    originalTeamPermissions: PermissionsModel.AccountAdminPermission[] = [];
    permissions: PermissionsModel.AccountAdminPermission[];
    teamsControl: FormControl = new FormControl();
    teamsList: any[];
    private leavePermissionsOpen: boolean = false;
    private subscriptions: Subscription[] = [];

    // maintain what permission
    private modificatePermissionCache = {
        toAdd: [],
        toDelete: [],
    };

    @select(['accountAdmin', 'permissionAreas', 'permissionAreas']) permissionsOb;
    @select(['accountAdmin', 'permissionAreas', 'requested']) permissionsReqOb;
    @select(['accountAdmin', 'userPermissionAreas', 'permissionAreas']) userPermissionsOb;
    @select(['accountAdmin', 'userPermissionAreas', 'requested']) userPermissionsReqOb;
    @select(['accountAdmin', 'teams', 'teams']) teamsOb;
    @select(['accountAdmin', 'teams', 'requested']) teamsReqOb;

    constructor(private service: AccountAdminPermissionsServiceBase,
                private redux: NgRedux<any>,
                private alerts: AlertsService,
                private teamsService: UserTeamsService,
                private translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
    }

    ngOnInit() {
        this.initSubscriptions();

        this.redux.dispatch(clearRequestedAccountAdminPermissionAreas());
        this.redux.dispatch(clearRequestedAccountAdminUserPermissionAreas());
    }

    private initSubscriptions(): void {
        let permissionsSub;
        let permissionsReqSub;

        if (this.isUser) {
            permissionsSub = this.userPermissionsOb
                .subscribe((permissions: PermissionsModel.AccountAdminPermission[]) => {
                    this.processPermissions(permissions);
                });

            permissionsReqSub = this.userPermissionsReqOb.subscribe((requested: boolean) => {
                this.requestUserPermissions(requested);
            });
        } else {
            permissionsSub = this.permissionsOb
                .subscribe((permissions: PermissionsModel.AccountAdminPermission[]) => {
                    this.originalTeamPermissions = permissions;
                    this.processPermissions(immutableHelper.copy(permissions));
                });

            permissionsReqSub = this.permissionsReqOb.subscribe((requested: boolean) => {
                this.requestTeamPermissions(requested);
            });
        }

        const teamsSub = this.teamsOb.subscribe((teams: TeamsModel.AccountAdminTeam[]) => {
            if (this.showTeamSelect) this.processTeams(teams);
        });

        const teamsReqSub = this.teamsReqOb.subscribe((requested: boolean) => {
            if (this.showTeamSelect) this.requestTeams(requested);
        });

        this.subscriptions.push(this.teamsControl.valueChanges.subscribe(() => {
            this.redux.dispatch(clearRequestedAccountAdminUserPermissionAreas());
        }));

        const doUpdateSub = this.doUpdateOb.subscribe((entityId: number) => {
            if (entityId !== undefined) this.entityId = entityId;

            this.doUpdatePermissions();
        });

        this.subscriptions.push(permissionsSub, permissionsReqSub, teamsSub, teamsReqSub, doUpdateSub);
    }

    private doUpdatePermissions(): void {
        this.updateState();
    }

    private requestUserPermissions(requested: boolean): void {
        if (requested) return;

        let id = this.teamsControl.value ? this.teamsControl.value[0].id : undefined;

        if (id === 9999) id = undefined;

        this.service.readUserPermissionAreas(this.entityId, id);
    }

    private requestTeamPermissions(requested: boolean): void {
        if (requested) return;

        this.service.readTeamPermissionAreas(this.entityId);
    }

    private processPermissions(permissions: PermissionsModel.AccountAdminPermission[]): void {
        _.forEach(permissions, (permission: PermissionsModel.AccountAdminPermission) => {
            permission.hidden = true;
        });

        this.permissions = permissions;
        this.entitiesFn.emit(this.permissions);
    }

    private requestTeams(requested: boolean): void {
        if (requested) return;

        this.teamsService.readUserTeams(null, null, () => {}, () => {});
    }

    private processTeams(teams: TeamsModel.AccountAdminTeam[]): void {
        const teamsList = [{
            id: 9999,
            text: this.translate.translate('All Teams'),
        }];

        _.forEach(teams, (team: TeamsModel.AccountAdminTeam) => {
            teamsList.push({
                id: team.userTeamID,
                text: team.name,
            });
        });

        this.teamsList = teamsList;

        if (!this.teamsControl.value) {
            this.teamsControl.patchValue([{
                id: 9999,
                text: this.translate.translate('All Teams'),
            }],                          {
                emitEvent: false,
                onlySelf: true,
            });
        }
    }

    updatePermission(): void {
        // Build modificatePermissionCache
        this.modificatePermissionCache =
            this.permissions.filter(v => v.parentID !== null).reduce(
                (acc, val) => {
                    const permMatchedArr = this.originalTeamPermissions.filter(
                        v => v.permissionAreaID === val.permissionAreaID,
                    );
                    const permData = (permMatchedArr[0] || {}) as PermissionsModel.AccountAdminPermission;

                    if (Boolean(val.state) !== Boolean(permData.state)) {
                        if (Boolean(val.state)) {
                            acc.toAdd.push(val.permissionAreaID);
                        } else {
                            acc.toDelete.push(val.permissionAreaID);
                        }
                    }

                    if (this.appConfig.platform === 'IZNES') {
                        acc = this.setPermissionRelationships(val, acc);
                    }

                    return acc;
                },
                { toAdd: [], toDelete: [] },
            );
    }

    setPermissionRelationships(permission, accumulator): any {
        // If key permission is enabled, then relatedPermission must be enabled
        const permissionRelationships = {
            'Action on Orders': {
                relatedPermission: 'View Orders',
            },
            'Update KYC Requests': {
                relatedPermission: 'View KYC Requests',
            },
        };

        if (permissionRelationships[permission.name]) {
            if (Boolean(permission.state) === true) {
                this.permissions.forEach((p, index) => {
                    if (p.name === permissionRelationships[permission.name].relatedPermission) {
                        // Enable the relatedPermission
                        this.permissions[index].state = true;
                        // Add the relatedPermission to the add queue
                        accumulator.toAdd.push(p.permissionAreaID);
                        // Remove the relatedPermission from the delete queue
                        accumulator.toDelete.forEach((d, index) => {
                            if (d === p.permissionAreaID) delete accumulator.toDelete[index];
                        });
                    }
                });
            }
        }

        return accumulator;
    }

    isProcessing(): boolean {
        return false;
    }

    isPermissionParent(permission: PermissionsModel.AccountAdminPermission): boolean {
        return permission.parentID === undefined || permission.parentID === null;
    }

    showParentAsOpen(permission: PermissionsModel.AccountAdminPermission): boolean {
        return (this.isPermissionParent(permission)) && !permission.hidden;
    }

    onRowClick(permission: PermissionsModel.AccountAdminPermission): void {
        if (this.isPermissionParent(permission)) {
            permission.hidden = permission.hidden ? false : true;

            _.forEach(this.permissions, (perm: PermissionsModel.AccountAdminPermission) => {
                if (perm.parentID === permission.permissionAreaID) perm.hidden = permission.hidden;
            });
        }
    }

    updateState(): void {
        this.service.updateTeamPermission(
            this.entityId,
            this.modificatePermissionCache.toAdd,
            this.modificatePermissionCache.toDelete,
            () => {},
            () => this.onUpdateStateError(),
        );
    }

    private onUpdateStateError(): void {
        this.alerts.create('error', this.translate.translate(
            'An error occured when updating permission'));
    }

    ngOnDestroy() {
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach((sub: Subscription) => {
                sub.unsubscribe();
            });
        }

        this.subscriptions = [];
        this.permissions, this.leavePermissionsOpen = undefined;
    }
}
