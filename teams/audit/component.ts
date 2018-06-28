import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';

import {
    clearRequestedAccountAdminTeamsAudit,
} from '@setl/core-store';
import * as Model from '../model';
import { UserTeamsService } from '../service';
import { AccountAdminAuditBase } from '../../base/audit/component';

import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-core-admin-teams-audit',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class UserTeamsAuditComponent extends AccountAdminAuditBase implements OnInit, OnDestroy {

    audit: Model.AccountAdminTeamAuditEntry[];

    @select(['accountAdmin', 'accountAdminTeamsAudit', 'requested']) teamsRequestedOb;
    @select(['accountAdmin', 'accountAdminTeamsAudit', 'teams']) teamsOb;

    constructor(private service: UserTeamsService,
                redux: NgRedux<any>,
                router: Router,
                translate: MultilingualService) {
        super(redux, router, translate);
        this.noun = 'Team';
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.push(this.teamsRequestedOb.subscribe((requested: boolean) => {
            this.requestTeamsAudit(requested);
        }));

        this.subscriptions.push(this.teamsOb.subscribe((audit: Model.AccountAdminTeamAuditEntry[]) => {
            this.audit = audit;
        }));
    }

    private requestTeamsAudit(requested: boolean): void {
        if (requested) return;

        const request = this.getSearchRequest('userTeamID');

        this.service.readUserTeamsAudit(request.userTeamID,
                                        request.dateFrom,
                                        request.dateTo,
                                        () => {},
                                        () => {});
    }

    protected updateData(): void {
        this.redux.dispatch(clearRequestedAccountAdminTeamsAudit());
    }

    ngOnDestroy() {}
}
