import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { ToasterService } from 'angular2-toaster';

import { immutableHelper } from '@setl/utils';
import {
    clearRequestedAccountAdminPermissionAreas,
    clearRequestedAccountAdminUserPermissionAreas,
} from '@setl/core-store';

import { UserManagementServiceBase } from './service';
import * as UserMgmtModel from './model';
import { AccountAdminErrorResponse, DataGridConfig, AccountAdminNouns } from '../../../base/model';

@Component({
    selector: 'app-core-admin-teams-mgmt',
    template: '<div></div>',
})
export class AccountAdminUsersMgmtComponentBase<Type> implements OnInit, OnDestroy {

    @Input() entityId: number;
    @Input() noun: string;
    @Input() doUpdate: boolean = true;
    @Output() entitiesFn: EventEmitter<Type[]> = new EventEmitter();

    datagridConfig: DataGridConfig;

    private entitiesArray: Type[];
    nameSearch: string = '';
    showOnlyActivated: boolean = false;

    protected accountId: number;
    protected state: UserMgmtModel.UserMgmtState = UserMgmtModel.UserMgmtState.Processing;
    protected subscriptions: Subscription[] = [];

    @select(['user', 'myDetail', 'accountId']) accountIdOb;

    constructor(protected redux: NgRedux<any>,
                protected service: UserManagementServiceBase,
                protected toaster: ToasterService) {
    }

    get entities(): Type[] {
        if (!this.showOnlyActivated) return this.entitiesArray;

        return _.filter(this.entitiesArray, (entity: any) => {
            return entity.isActivated === true;
        });
    }
    set entities(entities: Type[]) {
        this.entitiesArray = entities;
        this.entitiesFn.emit(entities);
    }

    ngOnInit() {
        this.subscriptions.push(this.accountIdOb.subscribe((accountId: number) => {
            this.accountId = accountId;
        }));

        this.initDataGridConfig();
    }

    initDataGridConfig(): void {
        console.error('method not implemented');
    }

    updateState(value: boolean, entity: Type): void {
        console.error('method not implemented');
    }

    searchByName(): void {
        console.error('method not implemented');
    }

    isProcessing(): boolean {
        return this.state === UserMgmtModel.UserMgmtState.Processing;
    }

    getCreateNewLink(): string {
        if (this.noun === AccountAdminNouns.Team) {
            return '/account-admin/teams/new';
        } else if (this.noun === AccountAdminNouns.User) {
            return '/account-admin/users/new';
        } else {
            return '/';
        }
    }

    protected processEntities(entities: any[]): any[] {
        const entitiesReturn: any[] = [];

        _.forEach(entities, (entity: any) => {
            entitiesReturn.push(immutableHelper.copy(entity));
        });

        return entitiesReturn;
    }

    protected updateUIState(): void {
        if ((this.entities) && this.entities.length > 0) this.state = UserMgmtModel.UserMgmtState.Default;
        if ((!this.entities) || this.entities.length === 0) this.state = UserMgmtModel.UserMgmtState.Empty;
    }

    protected onUpdateStateSuccess(state: boolean): void {
        this.redux.dispatch(clearRequestedAccountAdminPermissionAreas());
        this.redux.dispatch(clearRequestedAccountAdminUserPermissionAreas());

        this.toaster.clear();

        (state) ?
            this.toaster.pop('success', 'User added to team') :
            this.toaster.pop('info', 'User removed from team');
    }

    protected onRequestError(e: AccountAdminErrorResponse, entity?: any): void {
        this.toaster.clear();
        this.toaster.pop('error', e[1].Data[0].Message);

        if (entity) entity.isActivated = !entity.isActivated;
    }

    ngOnDestroy() {
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach((sub: Subscription) => {
                sub.unsubscribe();
            });
        }

        this.subscriptions = [];
        this.entities = undefined;
    }
}
