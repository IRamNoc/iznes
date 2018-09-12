import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import * as moment from 'moment';

import {
    clearRequestedAccountAdminTeamsAudit,
} from '@setl/core-store';
import { FileDownloader } from '@setl/utils';

import { AccountAdminBaseService } from '../../base/service';
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
                translate: MultilingualService,
                fileDownloader: FileDownloader,
                baseService: AccountAdminBaseService) {
        super(redux, translate, fileDownloader, baseService);
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
                    title: 'Reference',
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
                    title: 'Information',
                },
                {
                    id: 'Previous',
                    dataIndex: 'oldValue',
                    styleClass: 'previous',
                    title: 'Previous value',
                    valueDecorator: function (entity) {
                        if (entity.field === 'Status') {
                            if (entity.oldValue === '0') entity.oldValue = 'Disabled';
                            if (entity.oldValue === '1') entity.oldValue = 'Enabled';
                            if (entity.newValue === '0') entity.newValue = 'Disabled';
                            if (entity.newValue === '1') entity.newValue = 'Enabled';
                        }

                        if (entity.field === 'Users') {
                            if (entity.newValue === '0') entity.newValue = 'Removed from Team';
                            if (entity.newValue === '1') entity.newValue = 'Added to Team';
                        }

                        if (entity.field === 'Permissions') {
                            if (entity.newValue === '0') entity.newValue = 'Permission Removed';
                            if (entity.newValue === '1') entity.newValue = 'Permission Added';
                        }

                        return entity;
                    },
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
                    valueDecorator: function (entity) {
                        if (!entity._originalDateModified) {
                            entity._originalDateModified = entity.dateModified;
                            const utcDate = moment.utc(entity.dateModified).toDate();
                            entity.dateModified = moment(utcDate).format('YYYY-MM-DD HH:mm:ss');
                        }

                        return entity;
                    },
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

    protected exportEntitiesAsCSV(): void {
        this.baseService.getCSVExport(
            this.fileDownloader,
            this.csvRequest,
            'exportTeamsAuditCSV',
            this.token,
            this.userId,
            this.username,
            `${this.noun}Audit`,
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
