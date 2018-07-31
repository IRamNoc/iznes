import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { select, NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';

import {
    clearRequestedAccountAdminPermissionAreas,
    clearRequestedAccountAdminUserPermissionAreas,
} from '@setl/core-store';
import { AccountAdminPermissionsServiceBase } from './service';
import * as PermissionsModel from './model';

@Component({
    selector: 'app-core-admin-permissions',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class AccountAdminPermissionsComponentBase implements OnInit, OnDestroy {

    @Input() entityId: number;
    @Input() doUpdate: boolean = true;
    @Input() isUser: boolean = false;
    @Output() entitiesFn: EventEmitter<PermissionsModel.AccountAdminPermission[]> = new EventEmitter();

    permissions: PermissionsModel.AccountAdminPermission[];
    private subscriptions: Subscription[] = [];
    private leavePermissionsOpen: boolean = false;

    @select(['accountAdmin', 'permissionAreas', 'permissionAreas']) permissionsOb;
    @select(['accountAdmin', 'permissionAreas', 'requested']) permissionsReqOb;
    @select(['accountAdmin', 'userPermissionAreas', 'permissionAreas']) userPermissionsOb;
    @select(['accountAdmin', 'userPermissionAreas', 'requested']) userPermissionsReqOb;

    constructor(private service: AccountAdminPermissionsServiceBase,
                private redux: NgRedux<any>,
                private toaster: ToasterService,
                private alerts: AlertsService) { }

    ngOnInit() {
        this.initTeamsSubscriptions();

        this.redux.dispatch(clearRequestedAccountAdminPermissionAreas());
        this.redux.dispatch(clearRequestedAccountAdminUserPermissionAreas());
    }

    private initTeamsSubscriptions(): void {
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
                    this.processPermissions(permissions);
                });

            permissionsReqSub = this.permissionsReqOb.subscribe((requested: boolean) => {
                this.requestTeamPermissions(requested);
            });
        }

        this.subscriptions.push(permissionsSub, permissionsReqSub);
    }

    private requestUserPermissions(requested: boolean): void {
        if (requested) return;

        this.service.readUserPermissionAreas(this.entityId);
    }

    private requestTeamPermissions(requested: boolean): void {
        if (requested) return;

        this.service.readTeamPermissionAreas(this.entityId);
    }

    private processPermissions(permissions: PermissionsModel.AccountAdminPermission[]): void {
        if (!this.leavePermissionsOpen && permissions.length > 0) {
            // first time receiving permissions
            _.forEach(permissions, (permission: PermissionsModel.AccountAdminPermission) => {
                permission.hidden = true;
            });

            this.leavePermissionsOpen = true;
        } else {
            // everytime after
            _.forEach(permissions, (permission: PermissionsModel.AccountAdminPermission) => {
                permission.hidden = _.find(this.permissions, (p: PermissionsModel.AccountAdminPermission) => {
                    return p.permissionAreaID = permission.permissionAreaID;
                }).hidden;
            });
        }

        this.permissions = permissions;
        this.entitiesFn.emit(this.permissions);
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

    updateState(value: boolean, permission: PermissionsModel.AccountAdminPermission): void {
        if (this.doUpdate) {
            this.service.updateTeamPermission(
                value,
                this.entityId,
                permission.permissionAreaID,
                () => this.onUpdateStateSuccess(value, permission),
                () => this.onUpdateStateError(permission),
            );
        }
    }

    private onUpdateStateSuccess(value: boolean, permission: PermissionsModel.AccountAdminPermission): void {
        if (value) {
            this.toaster.clear();
            this.toaster.pop('success', `${permission.name} permission added`);
        } else {
            this.toaster.clear();
            this.toaster.pop('info', `${permission.name} permission removed`);
        }
    }

    private onUpdateStateError(permission: PermissionsModel.AccountAdminPermission): void {
        permission.state = !permission.state;

        this.alerts.create('error', `An error occured when adding ${permission.name} permission`);
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
