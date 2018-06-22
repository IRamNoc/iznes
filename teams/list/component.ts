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

    @select(['accountAdmin', 'accountAdminTeams', 'requested']) teamsRequestedOb;
    @select(['accountAdmin', 'accountAdminTeams', 'teams']) teamsOb;

    constructor(private service: UserTeamsService,
                router: Router,
                redux: NgRedux<any>,
                fileDownloader: FileDownloader) {
        super(router, redux, fileDownloader);
        this.noun = 'Team';
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
