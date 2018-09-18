import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { ToasterService } from 'angular2-toaster';

import { immutableHelper } from '@setl/utils';
import {
    clearRequestedAccountAdminPermissionAreas,
    clearRequestedAccountAdminUserPermissionAreas,
} from '@setl/core-store';

import { UserManagementServiceBase } from './service';
import * as UserMgmtModel from './model';
import { AccountAdminErrorResponse, DataGridConfig, AccountAdminNouns } from '../../../base/model';
import { AccountAdminUser } from '../../../users/model';
import { AccountAdminTeam } from '../../../teams/model';

@Component({
    selector: 'app-core-admin-teams-mgmt',
    template: '<div></div>',
})
export class AccountAdminUsersMgmtComponentBase<Type> implements OnInit, OnDestroy {

    @Input() entityId: number;
    @Input() disabled: boolean = false;
    @Input() noun: string;
    @Input() doUpdateOb: Subject<number>;
    @Input() doUpdate: boolean = true;
    @Input() showOnlyActiveFilter: boolean = true;
    @Output() entitiesFn: EventEmitter<any[]> = new EventEmitter();
    @Output() noActiveEntitiesFn: EventEmitter<() => boolean> = new EventEmitter();

    datagridConfig: DataGridConfig;

    protected entitiesArray: Type[];
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

    ngOnInit() {
        this.subscriptions.push(this.accountIdOb.subscribe((accountId: number) => {
            this.accountId = accountId;
        }));

        if (this.doUpdateOb) {
            this.subscriptions.push(this.doUpdateOb.subscribe((entityId: number) => {
                if (entityId !== undefined) this.entityId = entityId;

                this.updateEntityStates();
            }));
        }

        this.noActiveEntitiesFn.emit(() => this.hasActiveEntity());

        this.initDataGridConfig();
    }

    private updateEntityStates(): void {
        _.forEach(this.entities, (entity: Type) => {
            this.updateState(entity);
        });
    }

    private hasActiveEntity(): boolean {
        if (this.noun === AccountAdminNouns.User) return true;

        let hasActive = false;

        _.forEach(this.entities, (entity: Type) => {
            if (this.noun === AccountAdminNouns.Team &&
                (entity as any).isActivated &&
                (entity as any).status === 1) {
                hasActive = true;
            }
        });

        return hasActive;
    }

    protected initDataGridConfig(): void {
        console.error('method not implemented');
    }

    protected updateState(entity: Type): void {
        console.error('method not implemented');
    }

    searchByName(): void {
        console.error('method not implemented');
    }

    isProcessing(): boolean {
        return this.state === UserMgmtModel.UserMgmtState.Processing;
    }

    getCreateNewLink(): string {
        return `/account-admin/${this.noun.toLowerCase()}s/new`;
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

    protected onUpdateStateSuccess(state: boolean, entityName: string): void {
        this.redux.dispatch(clearRequestedAccountAdminPermissionAreas());
        this.redux.dispatch(clearRequestedAccountAdminUserPermissionAreas());
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
        this.entitiesArray = undefined;
    }
}
