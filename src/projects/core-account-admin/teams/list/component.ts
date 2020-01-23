import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { FileDownloader } from '@setl/utils';

import {
    clearRequestedAccountAdminTeams,
} from '@setl/core-store';

import * as Model from '../model';
import { UserTeamsService } from '../service';
import { AccountAdminListBase } from '../../base/list/component';
import { AccountAdminBaseService } from '../../base/service';
import { PermissionsService } from '@setl/utils/services/permissions';

@Component({
    selector: 'app-core-admin-teams-list',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UserTeamsListComponent extends AccountAdminListBase implements OnInit, OnDestroy {
    teams: Model.AccountAdminTeam[];

    public hasPermissionCreateTeams: boolean = false;
    public hasPermissionUpdateTeams: boolean = false;
    public hasPermissionDeleteTeams: boolean = false;

    @select(['accountAdmin', 'teams', 'requested']) teamsRequestedOb;
    @select(['accountAdmin', 'teams', 'teams']) teamsOb;

    constructor(private service: UserTeamsService,
                router: Router,
                redux: NgRedux<any>,
                protected fileDownloader: FileDownloader,
                protected baseService: AccountAdminBaseService,
                public permissionsService: PermissionsService) {
        super(router, redux, fileDownloader, baseService);
        this.noun = 'Team';
        this.csvRequest = {
            userTeamID: null,
            textSearch: null,
            isCSVRequest: true,
        };
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.push(this.teamsRequestedOb.subscribe((requested: boolean) => {
            this.requestTeams(requested);
        }));

        this.subscriptions.push(this.teamsOb.subscribe((teams: Model.AccountAdminTeam[]) => {
            this.teams = teams;
        }));

        this.redux.dispatch(clearRequestedAccountAdminTeams());

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
    }

    private requestTeams(requested: boolean): void {
        if (requested) return;

        this.service.readUserTeams(null, null, () => {}, () => {});
    }

    protected exportEntitiesAsCSV(): void {
        this.baseService.getCSVExport(
            this.fileDownloader,
            this.csvRequest,
            'exportTeamsCSV',
            this.token,
            this.userId,
            this.username,
            this.noun,
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        this.teams = undefined;
    }
}
