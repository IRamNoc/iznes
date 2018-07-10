import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';

import {
    clearRequestedAccountAdminUsers,
} from '@setl/core-store';
import { UserTeamsUsersMgmtComponentBase } from '../../../base/create-update/user-management/component';
import { AccountAdminErrorResponse, AccountAdminResponse } from '../../../base/model';
import { UserTeamsService } from '../../../teams';
import * as TeamModel from '../../../teams/model';
import { UserManagementServiceBase } from '../../../base/create-update/user-management/service';

@Component({
    selector: 'app-core-admin-users-team-mgmt',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UserTeamsUsersMgmtUsersComponent
    extends UserTeamsUsersMgmtComponentBase<TeamModel.AccountAdminTeam> implements OnInit, OnDestroy {

    @select(['accountAdmin', 'teams', 'requested']) teamsReqOb;
    @select(['accountAdmin', 'teams', 'teams']) teamsOb;

    constructor(redux: NgRedux<any>,
                service: UserManagementServiceBase,
                toaster: ToasterService,
                private teamsService: UserTeamsService) {
        super(redux, service, toaster);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.push(this.teamsReqOb.subscribe((requested: boolean) => {
            this.requestTeams(requested);
        }));

        this.subscriptions.push(this.teamsOb.subscribe((teams: TeamModel.AccountAdminTeam[]) => {
            this.entities = this.processEntities(teams);

            if (teams.length) {
                this.requestUserTeamMap();
            }
        }));
    }

    private requestTeams(requested: boolean): void {
        if (requested) return;

        this.teamsService.readUserTeams(null, () => {}, () => {});
    }

    private requestUserTeamMap(): void {
        this.service.readTeamUserMap(this.entityId,
                                     null,
                                     (data: AccountAdminResponse) => this.onRequestUserTeamMapSuccess(data),
                                     (e: AccountAdminErrorResponse) => this.onRequestError(e));
    }

    private onRequestUserTeamMapSuccess(data: AccountAdminResponse): void {
        this.processUserTeamMapData(data);

        this.updateUIState();
    }

    private processUserTeamMapData(data: AccountAdminResponse): void {
        if (!(data[1].Data) ||
            (data[1].Data as any).length === 0 ||
            (!this.entities) ||
            this.entities.length === 0) return;

        _.forEach(this.entities, (team: TeamModel.AccountAdminTeam) => {
            const result = _.find(data[1].Data, (res: any) => {
                return res.userTeamID === team.userTeamID &&
                    res.userID === this.entityId;
            });

            if (result) {
                team.hasUserInTeam = true;
            }
        });
    }

    updateState(value: boolean, userTeamId: number): void {
        this.service.updateTeamUserMap(
            value,
            this.entityId,
            userTeamId,
            () => this.onUpdateStateSuccess(value),
            (e: AccountAdminErrorResponse) => this.onRequestError(e),
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
