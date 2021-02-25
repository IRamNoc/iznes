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
import { SetlLoginModule } from '@setl/core-login';

import {
    AccountAdminCreateUpdateBase,
    AccountAdminAuditBase,
    AccountAdminListBase,
    AccountAdminBaseService,
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

import {
    AccountSignUpComponent,
    AccountSignUpRedirectComponent,
    AccountSignupService,
} from './signup';

import {
    Mt10xAmComponent,
    Mt10xInvComponent,
    Mt502Component,
    MtdashboardBaseComponent,
    MtdashboardService,
} from './mtdashboard';

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
        SetlLoginModule,
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
        AccountSignUpComponent,
        AccountSignUpRedirectComponent,
        Mt10xAmComponent,
        Mt10xInvComponent,
        Mt502Component,
        MtdashboardBaseComponent,
    ],
    providers: [
        UserTeamsService,
        UsersService,
        UserManagementServiceBase,
        AccountAdminPermissionsServiceBase,
        AccountAdminBaseService,
        AccountSignupService,
        MtdashboardService,
    ],
    exports: [],
})
export class CoreAccountAdminModule {
    constructor() {}
}
