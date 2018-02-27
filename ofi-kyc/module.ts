/* Core/Angular imports. */
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToasterModule, ToasterService} from 'angular2-toaster';

/* Pipes. */
import {SelectModule, SetlComponentsModule, SetlDirectivesModule, SetlPipesModule} from '@setl/utils';

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
import {OfiWaitingApprovalComponent} from './waiting-approval/component';
import {OfiFundAccessComponent} from './fund-access/component';
import {OfiAmDocumentsComponent} from './am-documents/component';
import {TextInputListComponent} from './text-input-list/component';
import {OfiKycAlreadyDoneComponent} from './already-done/component';

/* Decorator. */
@NgModule({
    declarations: [
        OfiInviteInvestorsComponent,
        OfiSignUpComponent,
        OfiDocumentsComponent,
        OfiKycHomeComponent,
        OfiWaitingApprovalComponent,
        OfiFundAccessComponent,
        OfiAmDocumentsComponent,
        OfiKycAlreadyDoneComponent,
        TextInputListComponent,
    ],
    exports: [
        OfiInviteInvestorsComponent,
        OfiSignUpComponent,
        OfiDocumentsComponent,
        OfiKycHomeComponent,
        OfiWaitingApprovalComponent,
        OfiFundAccessComponent,
        OfiAmDocumentsComponent,
        OfiKycAlreadyDoneComponent,
        TextInputListComponent,
    ],
    imports: [
        ToasterModule,
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
        ToasterService
    ]
})

/* Class. */
export class OfiKYCModule {

}
