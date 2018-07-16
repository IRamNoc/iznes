import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';

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

    @select(['accountAdmin', 'users', 'requested']) usersRequestedOb;
    @select(['accountAdmin', 'users', 'users']) usersOb;

    constructor(redux: NgRedux<any>,
                service: UserManagementServiceBase,
                toaster: ToasterService,
                private usersService: UsersService) {
        super(redux, service, toaster);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.push(this.usersRequestedOb.subscribe((requested: boolean) => {
            this.requestUsers(requested);
        }));

        this.subscriptions.push(this.usersOb.subscribe((users: UserModel.AccountAdminUser[]) => {
            this.entities = this.processEntities(users);

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
                    id: 'Ref',
                    dataIndex: 'reference',
                    styleClass: 'ref',
                    title: 'Ref',
                },
                {
                    id: 'FirstName',
                    dataIndex: 'firstName',
                    styleClass: 'firstname',
                    title: 'First name',
                },
                {
                    id: 'LastName',
                    dataIndex: 'lastName',
                    styleClass: 'lastname',
                    title: 'Last name',
                },
                {
                    id: 'Email',
                    dataIndex: 'emailAddress',
                    styleClass: 'email',
                    title: 'Email address',
                },
                {
                    id: 'PhoneNumber',
                    dataIndex: 'phoneNumber',
                    styleClass: 'phone',
                    title: 'Phone number',
                },
                {
                    id: 'UserType',
                    dataIndex: 'userType',
                    styleClass: 'usertype',
                    title: 'User Type',
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
        this.processUserTeamMapData(data);

        this.updateUIState();
    }

    private processUserTeamMapData(data: AccountAdminResponse): void {
        if (!(data[1].Data) ||
            (data[1].Data as any).length === 0 ||
            (!this.entities) ||
            this.entities.length === 0) return;

        _.forEach(this.entities, (user: UserModel.AccountAdminUser) => {
            const result = _.find(data[1].Data, (res: any) => {
                return res.userID === user.userID &&
                    res.userTeamID === this.entityId;
            });

            if (result) {
                user.userTeamID = result.userTeamID;
                user.isActivated = true;
            }
        });
    }

    updateState(value: boolean, entity: UserModel.AccountAdminUser): void {
        this.service.updateTeamUserMap(
            value,
            entity.userID,
            this.entityId,
            () => this.onUpdateStateSuccess(value),
            (e: AccountAdminErrorResponse) => this.onRequestError(e, entity),
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
