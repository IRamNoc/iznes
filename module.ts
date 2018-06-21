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
} from '@setl/utils';
import { ClarityModule } from '@clr/angular';
import { MultilingualModule } from '@setl/multilingual/multilingual.module';

import {
    UserTeamsAuditComponent,
    UserTeamsCreateUpdateComponent,
    UserTeamsListComponent,
    UserTeamsService,
} from './teams';

import {
    UsersAuditComponent,
    UsersCreateUpdateComponent,
    UsersListComponent,
} from './users';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        ClarityModule,
        SetlPipesModule,
        SetlComponentsModule,
        DynamicFormsModule,
        SetlDirectivesModule,
        MultilingualModule,
    ],
    declarations: [
        UserTeamsAuditComponent,
        UserTeamsCreateUpdateComponent,
        UserTeamsListComponent,
        UsersAuditComponent,
        UsersCreateUpdateComponent,
        UsersListComponent,
    ],
    providers: [UserTeamsService],
    exports: [],
})
export class CoreAccountAdminModule {
    constructor() {}
}
