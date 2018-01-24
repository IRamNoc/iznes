/* Core/Angular imports. */
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
/* Pipes. */
import {SelectModule, SetlPipesModule, SetlComponentsModule, SetlDirectivesModule} from '@setl/utils';
/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

import {MultilingualModule} from '@setl/multilingual';

/* Components. */
import {OfiHomeComponent} from './home/component';

/* Decorator. */
@NgModule({
    declarations: [
        OfiHomeComponent,
    ],
    exports: [
        OfiHomeComponent
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
        SetlDirectivesModule
    ],
    providers: [

    ]
})

/* Class. */
export class OfiHomeModule {

}
