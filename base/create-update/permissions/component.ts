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
    @Input() disableAll: boolean = false;
    @Input() doUpdateOb: Subject<number>;
    @Input() entityId: number;
    @Output() entitiesFn: EventEmitter<PermissionsModel.AccountAdminPermission[]> = new EventEmitter();
    @Input() isUser: boolean = false;
    @Input() showTeamSelect: boolean = true;

    appConfig: AppConfig;
    originalTeamPermissions: PermissionsModel.AccountAdminPermission[] = [];
    permissions: PermissionsModel.AccountAdminPermission[];
    permissionRelationships: any = [];

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

        if (this.appConfig.platform === 'IZNES') {
            this.initPermissionRelationships();
        }

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

    updatePermission(permission): void {
        // Set permission relationships
        if (this.appConfig.platform === 'IZNES') {
            this.setPermissionRelationships(permission);
        }

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
                            if (!acc.toAdd.includes(val.permissionAreaID)) {
                                acc.toAdd.push(val.permissionAreaID);
                            }
                        } else {
                            acc.toDelete.push(val.permissionAreaID);
                        }
                    }

                    return acc;
                },
                { toAdd: [], toDelete: [] },
            );
    }

    /**
    * Initialise permission relationships
    * 1. When a parent permission is enabled, then its related/child permission must also be enabled
    * 2. The related/child permission can only be disabled if the parent permission is first disabled
    */
    initPermissionRelationships(): void {
        this.permissionRelationships = {
            'Action on Orders': {
                related: ['View Orders'],
            },
            'Update KYC Requests': {
                related: ['View KYC Requests'],
            },
            'View Client Referentials': {
                related: ['View Portfolio Manager'],
            },
            'Update Client Referentials': {
                related: ['View Client Referentials'],
            },
            'Invite Investors': {
                related: ['View Client Referentials'],
            },
            'Update Portfolio Manager': {
                related: ['View Portfolio Manager', 'Invite Investors'],
            },
            'Create Product': {
                related: ['View Product'],
            },
            'Update Product': {
                related: ['View Product'],
            },
            'Create NAV': {
                related: ['View NAV'],
            },
            'Update NAV': {
                related: ['Create NAV'],
            },
            'Cancel NAV': {
                related: ['View NAV'],
            },
            'Update Management Company': {
                related: ['View Management Company'],
            },
            'Create Teams': {
                related: ['View Teams'],
            },
            'Update Teams': {
                related: ['View Teams'],
            },
            'Delete Teams': {
                related: ['Update Teams', 'Create Teams'],
            },
        };

        const toBeDisabled = [];

        // Initialise permissionRelationships for use in setPermissionRelationships()
        this.permissions.forEach((p, index) => {
            if (this.disableAll) p.disabled = true;

            if (!this.permissionRelationships.hasOwnProperty(p.name)) {
                this.permissionRelationships[p.name] = { related: [] };
            }

            const permissionObject = this.permissionRelationships[p.name];
            permissionObject.permissionIndex = index;
            permissionObject.permissionAreaID = p.permissionAreaID;

            // If the permission is enabled and it has a related/child permission, push child's name into toBeDisabled
            const permissionArray = this.permissionRelationships[p.name].related;

            permissionArray.forEach((permission) => {
                if (p.state && permission) {
                    toBeDisabled.push(permission);
                }
            });

        });

        if (toBeDisabled.length) {
            // Disable the related/child permission's toggle so that it cannot be set to 'OFF'
            toBeDisabled.forEach((p) => {
                this.permissions[this.permissionRelationships[p].permissionIndex].disabled = true;
            });
        }
    }

    /**
     * Set permission relationships
     * 1. When a parent permission is enabled (state === true), then its related/child permission must also be enabled
     * 2. The toggle for the related/child permission can only be set to 'OFF' if the parent permission is set to 'OFF'
     */
    setPermissionRelationships(permission): void {
        // If the enabled permission has a related/child permission...
        const permissionArray = this.permissionRelationships[permission.name].related;

        if (this.permissionRelationships[permission.name] && permissionArray.length > 0) {
            const relatedPermission = this.permissionRelationships[permission.name].related;

            relatedPermission.forEach((permissionName) => {
                if (this.permissionRelationships[permissionName]) {
                    const relatedPermissionObject = this.permissionRelationships[permissionName];

                    // 1: Enable the related/child permission
                    if (Boolean(permission.state)) {
                        this.permissions[relatedPermissionObject.permissionIndex].state = true;
                    }

                    // 2: Disable/enable the child's toggle depending on its whether its parent is disabled/enabled
                    this.permissions[relatedPermissionObject.permissionIndex].disabled = Boolean(permission.state);

                    // Check if the related/child permission has its own related/child permission...
                    this.setPermissionRelationships(this.permissions[relatedPermissionObject.permissionIndex]);
                }
            });
        }
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
