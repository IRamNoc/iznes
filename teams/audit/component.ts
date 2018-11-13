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
                    title: this.translate.translate('Reference'),
                },
                {
                    id: 'Team',
                    dataIndex: 'name',
                    styleClass: 'name',
                    title: this.translate.translate('Team'),
                },
                {
                    id: 'Field',
                    dataIndex: 'field',
                    styleClass: 'field',
                    title: this.translate.translate('Information'),
                },
                {
                    id: 'Previous',
                    dataIndex: 'oldValue',
                    styleClass: 'previous',
                    title: this.translate.translate('Previous Value'),
                    valueDecorator: (entity) => {
                        if (entity.field === 'Status') {
                            if (entity.oldValue === '0') entity.oldValue = this.translate.translate('Disabled');
                            if (entity.oldValue === '1') entity.oldValue = this.translate.translate('Enabled');
                            if (entity.newValue === '0') entity.newValue = this.translate.translate('Disabled');
                            if (entity.newValue === '1') entity.newValue = this.translate.translate('Enabled');
                        }

                        if (entity.field === 'Users') {
                            if (entity.newValue === '0') entity.newValue = this.translate.translate('Removed from Team');
                            if (entity.newValue === '1') entity.newValue = this.translate.translate('Added to Team');
                        }

                        if (entity.field === 'Permissions') {
                            if (entity.newValue === '0') entity.newValue = this.translate.translate('Permission Removed');
                            if (entity.newValue === '1') entity.newValue = this.translate.translate('Permission Added');
                        }

                        return entity;
                    },
                },
                {
                    id: 'New',
                    dataIndex: 'newValue',
                    styleClass: 'new',
                    title: this.translate.translate('New Value'),
                },
                {
                    id: 'ModifiedBy',
                    dataIndex: 'userName',
                    styleClass: 'modifiedby',
                    title: this.translate.translate('Modified By'),
                },
                {
                    id: 'Date',
                    dataIndex: 'dateModified',
                    styleClass: 'date',
                    title: this.translate.translate('Date'),
                    valueDecorator: (entity) => {
                        if (!entity._originalDateModified) {
                            entity._originalDateModified = entity.dateModified;
                            entity.dateModified = moment(entity._originalDateModified).format('YYYY-MM-DD HH:mm:ss');
                        }

                        return entity;
                    },
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
