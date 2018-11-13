import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';
import { MultilingualService } from '@setl/multilingual';

import {
    clearRequestedAccountAdminTeams,
} from '@setl/core-store';

import { AccountAdminUsersMgmtComponentBase } from '../../../base/create-update/user-management/component';
import { AccountAdminErrorResponse, AccountAdminResponse } from '../../../base/model';
import { UserTeamsService } from '../../../teams';
import * as TeamModel from '../../../teams/model';
import { UserManagementServiceBase } from '../../../base/create-update/user-management/service';

@Component({
    selector: 'app-core-admin-users-team-mgmt',
    templateUrl: '../../../base/create-update/user-management/component.html',
    styleUrls: ['../../../base/create-update/user-management/component.scss'],
})
export class UserTeamsUsersMgmtUsersComponent
    extends AccountAdminUsersMgmtComponentBase<TeamModel.AccountAdminTeam> implements OnInit, OnDestroy {

    @select(['accountAdmin', 'teams', 'requested']) teamsReqOb;
    @select(['accountAdmin', 'teams', 'teams']) teamsOb;

    constructor(redux: NgRedux<any>,
                service: UserManagementServiceBase,
                toaster: ToasterService,
                private translate: MultilingualService,
                private teamsService: UserTeamsService) {
        super(redux, service, toaster);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.push(this.teamsReqOb.subscribe((requested: boolean) => {
            this.requestTeams(requested);
        }));

        this.subscriptions.push(this.teamsOb.subscribe((teams: TeamModel.AccountAdminTeam[]) => {
            this.entitiesArray = this.processEntities(teams);

            if (teams.length) {
                this.requestUserTeamMap();
            }
        }));

        this.redux.dispatch(clearRequestedAccountAdminTeams());
    }

    initDataGridConfig(): void {
        this.datagridConfig = {
            idIndex: 'userTeamID',
            columns: [
                {
                    id: 'Reference',
                    dataIndex: 'reference',
                    styleClass: 'ref',
                    title: this.translate.translate('Reference'),
                },
                {
                    id: 'Name',
                    dataIndex: 'name',
                    styleClass: 'name',
                    title: this.translate.translate('Name'),
                },
                {
                    id: 'Description',
                    dataIndex: 'description',
                    styleClass: 'description',
                    title: this.translate.translate('Description'),
                },
                {
                    id: 'Status',
                    dataIndex: 'status',
                    styleClass: 'status',
                    title: this.translate.translate('Status'),
                },
            ],
        };
    }

    searchByName(): void {
        this.redux.dispatch(clearRequestedAccountAdminTeams());
    }

    private requestTeams(requested: boolean): void {
        if (requested) return;

        this.teamsService.readUserTeams(null, this.nameSearch, () => {}, () => {});
    }

    private requestUserTeamMap(): void {
        this.service.readTeamUserMap(this.entityId,
                                     null,
                                     (data: AccountAdminResponse) => this.onRequestUserTeamMapSuccess(data),
                                     (e: AccountAdminErrorResponse) => this.onRequestError(e));
    }

    private onRequestUserTeamMapSuccess(data: AccountAdminResponse): void {
        this.processUserTeamMapData(data[1].Data as any);

        this.updateUIState();
    }

    private processUserTeamMapData(data): void {
        _.forEach(this.entitiesArray, (team: TeamModel.AccountAdminTeam, index: number) => {
            const result = _.find(data, (res: any) => {
                return res.userTeamID === team.userTeamID &&
                    res.userID === this.entityId;
            });

            this.entitiesArray[index].isActivated = (result) ? true : false;
        });

        this.entitiesFn.emit(this.entitiesArray);
    }

    updateState(entity: TeamModel.AccountAdminTeam): void {
        if (this.doUpdate) {
            this.service.updateTeamUserMap(
                entity.isActivated,
                this.entityId,
                entity.userTeamID,
                () => this.onUpdateStateSuccess(entity.isActivated, entity.name),
                (e: AccountAdminErrorResponse) => this.onRequestError(e, entity),
            );
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
