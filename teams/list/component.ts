import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import { FileDownloader } from '@setl/utils';

import * as Model from '../model';
import { AccountAdminListBase } from '../../base/list/component';

@Component({
    selector: 'app-core-admin-teams-list',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UserTeamsListComponent extends AccountAdminListBase implements OnInit, OnDestroy {

    teams: Model.AccountAdminTeam[];

    constructor(router: Router,
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

    ngOnInit() {}

    ngOnDestroy() {}
}
