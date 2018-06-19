import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule, SetlComponentsModule, SetlDirectivesModule, SetlPipesModule } from '@setl/utils';
import { ClarityModule } from '@clr/angular';
import { MultilingualModule } from '@setl/multilingual/multilingual.module';

import {
    UserTeamsCreateUpdateComponent,
    UserTeamsListComponent,
} from './teams';

import {
    UsersCreateUpdateComponent,
    UsersListComponent,
} from './users';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        ClarityModule,
        SetlPipesModule,
        SetlComponentsModule,
        SetlDirectivesModule,
        MultilingualModule,
    ],
    declarations: [
        UserTeamsCreateUpdateComponent,
        UserTeamsListComponent,
        UsersCreateUpdateComponent,
        UsersListComponent,
    ],
    providers: [],
    exports: [],
})
export class CoreAccountAdminModule {
    constructor() {}
}
