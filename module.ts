import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    SelectModule,
    SetlComponentsModule,
    SetlDirectivesModule,
    SetlPipesModule,
    DynamicFormsModule,
    DpDatePickerModule,
} from '@setl/utils';
import { ClarityModule } from '@clr/angular';
import { MultilingualModule } from '@setl/multilingual/multilingual.module';
import { PermissionGridModule } from '@setl/permission-grid';

import {
    AccountAdminCreateUpdateBase,
    AccountAdminAuditBase,
    AccountAdminListBase,
    UserManagementServiceBase,
    AccountAdminUsersMgmtComponentBase,
    AccountAdminPermissionsComponentBase,
    AccountAdminPermissionsServiceBase,
    AccountAdminStatusComponentBase,
} from './base';

import {
    UserTeamsAuditComponent,
    UserTeamsCreateUpdateComponent,
    UserTeamsListComponent,
    UserTeamsService,
    UserTeamsUsersMgmtTeamsComponent,
    UserTeamsStatusComponent,
} from './teams';

import {
    UsersAuditComponent,
    UsersCreateUpdateComponent,
    UsersListComponent,
    UsersService,
    UserTeamsUsersMgmtUsersComponent,
    UsersStatusComponent,
} from './users';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        DpDatePickerModule,
        ReactiveFormsModule,
        SelectModule,
        ClarityModule,
        SetlPipesModule,
        SetlComponentsModule,
        DynamicFormsModule,
        SetlDirectivesModule,
        MultilingualModule,
        PermissionGridModule,
    ],
    declarations: [
        AccountAdminCreateUpdateBase,
        AccountAdminAuditBase,
        AccountAdminListBase,
        UserTeamsAuditComponent,
        UserTeamsCreateUpdateComponent,
        UserTeamsListComponent,
        UsersAuditComponent,
        UsersListComponent,
        UserTeamsUsersMgmtTeamsComponent,
        UserTeamsUsersMgmtUsersComponent,
        AccountAdminUsersMgmtComponentBase,
        UsersCreateUpdateComponent,
        AccountAdminPermissionsComponentBase,
        AccountAdminStatusComponentBase,
        UserTeamsStatusComponent,
        UsersStatusComponent,
    ],
    providers: [
        UserTeamsService,
        UsersService,
        UserManagementServiceBase,
        AccountAdminPermissionsServiceBase,
    ],
    exports: [],
})
export class CoreAccountAdminModule {
    constructor() {}
}
