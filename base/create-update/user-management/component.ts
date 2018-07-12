import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { ToasterService } from 'angular2-toaster';
import { immutableHelper } from '@setl/utils';
import { UserManagementServiceBase } from './service';
import * as UserMgmtModel from './model';
import { AccountAdminErrorResponse, DataGridConfig } from '../../../base/model';
import * as _ from 'lodash';

@Component({
    selector: 'app-core-admin-teams-mgmt',
    template: '<div></div>',
})
export class UserTeamsUsersMgmtComponentBase<Type> implements OnInit, OnDestroy {

    @Input() entityId: number;

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
        (state) ?
            this.toaster.pop('success', 'User added to team') :
            this.toaster.pop('info', 'User removed from team');
    }

    protected onRequestError(e: AccountAdminErrorResponse, entity?: any): void {
        this.toaster.pop('error', e[1].Data[0].Message);

        if (entity) entity.isActivated = !entity.isActivated;
    }

    ngOnDestroy() {
        this.entities = undefined;

        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach((sub: Subscription) => {
                sub.unsubscribe();
            });
        }
    }
}
