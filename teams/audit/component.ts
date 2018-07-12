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
    templateUrl: '../../base/audit/component.html',
    styleUrls: ['../../base/audit/component.scss'],
})
export class UserTeamsAuditComponent
    extends AccountAdminAuditBase<Model.AccountAdminTeamAuditEntry> implements OnInit, OnDestroy {

    @select(['accountAdmin', 'teamsAudit', 'requested']) teamsRequestedOb;
    @select(['accountAdmin', 'teamsAudit', 'teams']) teamsOb;

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

        this.service.readUserTeamsAudit(request.search,
                                        request.dateFrom,
                                        request.dateTo,
                                        () => {},
                                        () => {});
    }

    protected updateData(): void {
        this.redux.dispatch(clearRequestedAccountAdminTeamsAudit());
    }

    initDataGridConfig(): void {
        this.datagridConfig = {
            idIndex: 'userTeamID',
            columns: [
                {
                    id: 'Ref',
                    dataIndex: 'reference',
                    styleClass: 'ref',
                    title: 'Ref',
                },
                {
                    id: 'Team',
                    dataIndex: 'name',
                    styleClass: 'name',
                    title: 'Team',
                },
                {
                    id: 'Field',
                    dataIndex: 'field',
                    styleClass: 'field',
                    title: 'field',
                },
                {
                    id: 'Previous',
                    dataIndex: 'oldValue',
                    styleClass: 'previous',
                    title: 'Previous value',
                },
                {
                    id: 'New',
                    dataIndex: 'newValue',
                    styleClass: 'new',
                    title: 'New value',
                },
                {
                    id: 'ModifiedBy',
                    dataIndex: 'userName',
                    styleClass: 'modifiedby',
                    title: 'Modified by',
                },
                {
                    id: 'Date',
                    dataIndex: 'dateModified',
                    styleClass: 'date',
                    title: 'Date',
                },
            ],
        };
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
