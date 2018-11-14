import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';
import { MultilingualService } from '@setl/multilingual';

import {
    clearRequestedAccountAdminUsers,
} from '@setl/core-store';

import { AccountAdminUsersMgmtComponentBase } from '../../../base/create-update/user-management/component';
import { AccountAdminErrorResponse, AccountAdminResponse } from '../../../base/model';
import { UsersService } from '../../../users/service';
import * as UserModel from '../../../users/model';
import { UserManagementServiceBase } from '../../../base/create-update/user-management/service';

@Component({
    selector: 'app-core-admin-teams-user-mgmt',
    templateUrl: '../../../base/create-update/user-management/component.html',
    styleUrls: ['../../../base/create-update/user-management/component.scss'],
})
export class UserTeamsUsersMgmtTeamsComponent
    extends AccountAdminUsersMgmtComponentBase<UserModel.AccountAdminUser> implements OnInit, OnDestroy {

    @Input() doUpdate: boolean = true;
    @Output() entitiesFn: EventEmitter<any[]> = new EventEmitter();

    @select(['accountAdmin', 'users', 'requested']) usersRequestedOb;
    @select(['accountAdmin', 'users', 'users']) usersOb;

    constructor(redux: NgRedux<any>,
                service: UserManagementServiceBase,
                toaster: ToasterService,
                public translate: MultilingualService,
                private usersService: UsersService) {
        super(redux, service, translate, toaster);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.push(this.usersRequestedOb.subscribe((requested: boolean) => {
            this.requestUsers(requested);
        }));

        this.subscriptions.push(this.usersOb.subscribe((users: UserModel.AccountAdminUser[]) => {
            this.entitiesArray = this.processEntities(users);

            if (users.length) {
                this.requestUserTeamMap();
            }
        }));

        this.redux.dispatch(clearRequestedAccountAdminUsers());
    }

    initDataGridConfig(): void {
        this.datagridConfig = {
            idIndex: 'userID',
            columns: [
                {
                    id: 'Reference',
                    dataIndex: 'reference',
                    styleClass: 'ref',
                    title: this.translate.translate('Reference'),
                },
                {
                    id: 'FirstName',
                    dataIndex: 'firstName',
                    styleClass: 'firstname',
                    title: this.translate.translate('First Name'),
                },
                {
                    id: 'LastName',
                    dataIndex: 'lastName',
                    styleClass: 'lastname',
                    title: this.translate.translate('Last Name'),
                },
                {
                    id: 'Email',
                    dataIndex: 'emailAddress',
                    styleClass: 'email',
                    title: this.translate.translate('Email Address'),
                },
                {
                    id: 'PhoneNumber',
                    dataIndex: 'phoneNumber',
                    styleClass: 'phone',
                    title: this.translate.translate('Phone Number'),
                },
                {
                    id: 'UserType',
                    dataIndex: 'userType',
                    styleClass: 'usertype',
                    title: this.translate.translate('User Type'),
                },
                {
                    id: 'Status',
                    dataIndex: 'status',
                    styleClass: 'status',
                    title: this.translate.translate('Status'),
                },
            ],
        };
    }

    searchByName(): void {
        this.redux.dispatch(clearRequestedAccountAdminUsers());
    }

    private requestUsers(requested: boolean): void {
        if (requested) return;

        this.usersService.readUsers(null, this.accountId, this.nameSearch, () => {}, () => {});
    }

    private requestUserTeamMap(): void {
        this.service.readTeamUserMap(null,
                                     this.entityId,
                                     (data: AccountAdminResponse) => this.onRequestUserTeamMapSuccess(data),
                                     (e: AccountAdminErrorResponse) => this.onRequestError(e));
    }

    private onRequestUserTeamMapSuccess(data: AccountAdminResponse): void {
        this.processUserTeamMapData(data[1].Data as any);

        this.updateUIState();
    }

    private processUserTeamMapData(data): void {
        _.forEach(this.entitiesArray, (user: UserModel.AccountAdminUser, index: number) => {
            if ((!data) || data.length === 0) {
                this.entitiesArray[index].isActivated = false;
                return;
            }

            const result = _.find(data, (res: any) => {
                return res.userID === user.userID &&
                    res.userTeamID === this.entityId;
            });

            if (result) {
                this.entitiesArray[index].userTeamID = result.userTeamID;
            }

            this.entitiesArray[index].isActivated = (result) ? true : false;
        });
    }

    updateState(entity: UserModel.AccountAdminUser): void {
        if (this.doUpdate) {
            this.service.updateTeamUserMap(
                entity.isActivated,
                entity.userID,
                this.entityId,
                () => this.onUpdateStateSuccess(entity.isActivated, entity.emailAddress),
                (e: AccountAdminErrorResponse) => this.onRequestError(e, entity),
            );
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
