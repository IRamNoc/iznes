/* Core/Angular imports. */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Pipes. */
import { SelectModule, SetlComponentsModule, SetlDirectivesModule, SetlPipesModule } from '@setl/utils';
/* Clarity module. */
import { ClarityModule } from '@clr/angular';

import { MultilingualModule } from '@setl/multilingual';
/* Components. */
import { OfiLoginComponent } from './login/component';
import { SetlLayoutModule } from '@setl/core-layout';
import { SetlLoginModule } from '@setl/core-login';

/* Decorator. */
@NgModule({
    declarations: [
        OfiLoginComponent,
    ],
    exports: [
        OfiLoginComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        RouterModule,
        MultilingualModule,
        SelectModule,
        SetlPipesModule,
        SetlComponentsModule,
        SetlDirectivesModule,
        SetlLayoutModule,
        SetlLoginModule,
    ],
    providers: [],
})

/* Class. */
export class OfiLoginModule {

}
