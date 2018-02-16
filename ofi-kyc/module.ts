/* Core/Angular imports. */
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
/* Pipes. */
import {SelectModule, SetlPipesModule, SetlComponentsModule, SetlDirectivesModule} from '@setl/utils';
/* Clarity module. */
import {ClarityModule} from '@clr/angular';

import {MultilingualModule} from '@setl/multilingual';

/* Components. */
import {OfiInviteInvestorsComponent} from './invite-investors/component';
import {OfiSignUpComponent} from './signup/component';
import {OfiDocumentsComponent} from './documents/component';
import {MockKYCDocumentsService} from './documents/documents.mock.service';

/* Decorator. */
@NgModule({
    declarations: [
        OfiInviteInvestorsComponent,
        OfiSignUpComponent,
        OfiDocumentsComponent,
    ],
    exports: [
        OfiInviteInvestorsComponent,
        OfiSignUpComponent,
        OfiDocumentsComponent,
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
        MockKYCDocumentsService,
    ]
})

/* Class. */
export class OfiKYCModule {

}
