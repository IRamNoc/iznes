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
    UserTeamsUsersMgmtComponentBase,
    UserTeamsPermissionsComponentBase,
    UserTeamsPermissionsServiceBase,
} from './base';

import {
    UserTeamsAuditComponent,
    UserTeamsCreateUpdateComponent,
    UserTeamsListComponent,
    UserTeamsService,
    UserTeamsUsersMgmtTeamsComponent,
} from './teams';

import {
    UsersAuditComponent,
    UsersCreateUpdateComponent,
    UsersListComponent,
    UsersService,
    UserTeamsUsersMgmtUsersComponent,
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
        UserTeamsUsersMgmtComponentBase,
        UsersCreateUpdateComponent,
        UserTeamsPermissionsComponentBase,
    ],
    providers: [
        UserTeamsService,
        UsersService,
        UserManagementServiceBase,
        UserTeamsPermissionsServiceBase,
    ],
    exports: [],
})
export class CoreAccountAdminModule {
    constructor() {}
}
