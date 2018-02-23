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
import {OfiKycHomeComponent} from './home/component';
import {OfiMyInformationsModule} from '../ofi-my-informations/module';
import {OfiFundAccessComponent} from './fund-access/component';
import {TextInputListComponent} from './text-input-list/component';
import {OfiKycAlreadyDoneComponent} from './already-done/component';

/* Decorator. */
@NgModule({
    declarations: [
        OfiInviteInvestorsComponent,
        OfiSignUpComponent,
        OfiDocumentsComponent,
        OfiKycHomeComponent,
        OfiFundAccessComponent,
        OfiKycAlreadyDoneComponent,
        TextInputListComponent,
    ],
    exports: [
        OfiInviteInvestorsComponent,
        OfiSignUpComponent,
        OfiDocumentsComponent,
        OfiKycHomeComponent,
        OfiFundAccessComponent,
        OfiKycAlreadyDoneComponent,
        TextInputListComponent,
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
        OfiMyInformationsModule,
    ],
    providers: [
        MockKYCDocumentsService,
    ]
})

/* Class. */
export class OfiKYCModule {

}
