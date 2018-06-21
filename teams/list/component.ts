import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';

import { FileDownloader } from '@setl/utils';

import * as Model from '../model';
import { UserTeamsService } from '../service';
import { AccountAdminListBase } from '../../base/list/component';

@Component({
    selector: 'app-core-admin-teams-list',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UserTeamsListComponent extends AccountAdminListBase implements OnInit, OnDestroy {

    teams: Model.AccountAdminTeam[];

    @select(['accountAdmin', 'requestedAccountAdminTeams']) teamsRequestedOb;
    @select(['accountAdmin', 'accountAdminTeams']) teamsOb;

    constructor(private service: UserTeamsService,
                router: Router,
                redux: NgRedux<any>,
                fileDownloader: FileDownloader) {
        super('Team', router, redux, fileDownloader);

        this.teams = [
            {
                userTeamID: 1,
                name: 'Team 1',
                accountId: 1,
                status: false,
                reference: 'TEAM1REF',
                description: 'Lorem ipsum dolor sit amet',
            },
            {
                userTeamID: 2,
                name: 'Team 2',
                accountId: 1,
                status: true,
                reference: 'TEAM2REF',
                description: 'Lorem ipsum dolor sit amet',
            },
            {
                userTeamID: 3,
                name: 'Team 3',
                accountId: 1,
                status: true,
                reference: 'TEAM3REF',
                description: 'Lorem ipsum dolor sit amet',
            },
        ];
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.push(this.teamsRequestedOb.subscribe((requested: boolean) => {
            this.requestTeams(requested);
        }));

        this.subscriptions.push(this.teamsOb.subscribe((teams: Model.AccountAdminTeam[]) => {
            this.teams = teams;
        }));
    }

    private requestTeams(requested: boolean): void {
        if (requested) return;

        this.service.readUserTeams(null, () => {}, () => {});
    }

    ngOnDestroy() {}
}
