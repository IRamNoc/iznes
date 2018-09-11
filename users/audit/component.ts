import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import * as moment from 'moment';

import { MultilingualService } from '@setl/multilingual';
import {
    clearRequestedAccountAdminUsersAudit,
} from '@setl/core-store';
import { FileDownloader, immutableHelper } from '@setl/utils';

import { AccountAdminBaseService } from '../../base/service';
import { AccountAdminAuditBase } from '../../base/audit/component';
import { UsersService } from '../service';
import * as Model from '../model';

@Component({
    selector: 'app-core-admin-users-audit',
    templateUrl: '../../base/audit/component.html',
    styleUrls: ['../../base/audit/component.scss'],
})
export class UsersAuditComponent
    extends AccountAdminAuditBase<Model.AccountAdminUserAuditEntry> implements OnInit, OnDestroy {

    @select(['accountAdmin', 'usersAudit', 'requested']) usersRequestedOb;
    @select(['accountAdmin', 'usersAudit', 'users']) usersOb;

    constructor(private service: UsersService,
                redux: NgRedux<any>,
                translate: MultilingualService,
                fileDownloader: FileDownloader,
                baseService: AccountAdminBaseService) {
        super(redux, translate, fileDownloader, baseService);
        this.noun = 'User';
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.push(this.usersRequestedOb.subscribe((requested: boolean) => {
            this.requestUsersAudit(requested);
        }));

        this.subscriptions.push(this.usersOb.subscribe((audit: Model.AccountAdminUserAuditEntry[]) => {
            this.audit = immutableHelper.copy(audit);
        }));
    }

    private requestUsersAudit(requested: boolean): void {
        if (requested) return;

        const request = this.getSearchRequest('userID');

        this.service.readUsersAudit(request.search,
                                    request.dateFrom,
                                    request.dateTo,
                                    () => {},
                                    () => {});
    }

    protected updateData(): void {
        this.redux.dispatch(clearRequestedAccountAdminUsersAudit());
    }

    initDataGridConfig(): void {
        this.datagridConfig = {
            idIndex: 'userID',
            columns: [
                {
                    id: 'Ref',
                    dataIndex: 'reference',
                    styleClass: 'ref',
                    title: 'Reference',
                },
                {
                    id: 'User',
                    dataIndex: 'userName',
                    styleClass: 'name',
                    title: 'User',
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
                            if (entity.oldValue === '0') entity.oldValue = 'Enabled';
                            if (entity.oldValue === '1') entity.oldValue = 'Disabled';
                            if (entity.newValue === '0') entity.newValue = 'Enabled';
                            if (entity.newValue === '1') entity.newValue = 'Disabled';
                        }

                        if (entity.field === 'Teams') {
                            if (entity.newValue === '0') entity.newValue = 'Removed from Team';
                            if (entity.newValue === '1') entity.newValue = 'Added to Team';
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
                    dataIndex: 'modifiedBy',
                    styleClass: 'modifiedby',
                    title: 'Modified by',
                },
                {
                    id: 'Date',
                    dataIndex: 'dateModified',
                    styleClass: 'date',
                    title: 'Date',
                    valueDecorator: function (entity) {
                        if (!entity._originalDateModified) {
                            entity._originalDateModified = entity.dateModified;
                            const utcDate = moment.utc(entity.dateModified).toDate();
                            entity.dateModified = moment(utcDate).format('YYYY-MM-DD HH:mm:ss');
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
            'exportUsersAuditCSV',
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
