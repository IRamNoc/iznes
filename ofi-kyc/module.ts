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
import {FileDropModule} from '@setl/core-filedrop';
import {FileViewerModule} from "@setl/core-fileviewer";
import {OfiRedirectTokenComponent} from './invitation-token/redirect-token.component';
import {OfiConsumeTokenComponent} from './invitation-token/consume-token.component';

import {MyRequestsContainerComponent} from './my-requests/my-requests-container.component';
import {MyRequestsComponent} from './my-requests/list/my-requests.component';
import {MyRequestComponent} from './my-requests/list/my-request.component';
import {MyRequestsGridComponent} from './my-requests/list/list-grid.component';
import {NewKycRequestComponent} from './my-requests/request/new-request.component';
import {NewKycSelectAmcComponent} from './my-requests/request/steps/select-amc.component';
import {NewKycIntroductionComponent} from './my-requests/request/steps/introduction.component';

import {RequestsService} from './my-requests/requests.service';

/* Constants */
import config from './config';

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
        OfiRedirectTokenComponent,
        OfiConsumeTokenComponent,
        MyRequestsComponent,
        MyRequestComponent,
        MyRequestsGridComponent,
        NewKycRequestComponent,
        NewKycSelectAmcComponent,
        NewKycIntroductionComponent,
        MyRequestsContainerComponent
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
        OfiRedirectTokenComponent,
        OfiConsumeTokenComponent,
        MyRequestsComponent,
        MyRequestComponent,
        NewKycRequestComponent,
        MyRequestsContainerComponent
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
        FileDropModule,
        FileViewerModule
    ],
    providers: [
        RequestsService,
        MockKYCDocumentsService,
        ToasterService,
        {provide: 'endpoints', useValue: config},
    ]
})

/* Class. */
export class OfiKYCModule {

}
