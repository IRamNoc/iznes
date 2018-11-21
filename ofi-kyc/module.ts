/* Core/Angular imports. */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterModule, ToasterService } from 'angular2-toaster';

/* Pipes. */
import {
    SelectModule,
    SetlComponentsModule,
    SetlDirectivesModule,
    SetlPipesModule,
    DpDatePickerModule,
} from '@setl/utils';

/* Clarity module. */
import { ClarityModule } from '@clr/angular';
import { MultilingualModule } from '@setl/multilingual';
import { SetlLoginModule } from '@setl/core-login';

/* Components. */
import { OfiInviteInvestorsComponent } from './invite-investors/component';
import { OfiSignUpComponent } from './signup/component';
import { OfiDocumentsComponent } from './documents/component';
import { MockKYCDocumentsService } from './documents/documents.mock.service';
import { OfiKycHomeComponent } from './home/component';
import { OfiMyInformationsModule } from '../ofi-my-informations/module';
import { OfiWaitingApprovalComponent } from './waiting-approval/component';
import { OfiAmDocumentsComponent } from './am-documents/component';
import { TextInputListComponent } from './text-input-list/component';
import { OfiKycAlreadyDoneComponent } from './already-done/component';
import { KycAuditTrailComponent } from './audit-trail/kyc-audit-trail.component';
import { KycStatusAuditTrailComponent } from './audit-trail/status-audit-trail/kyc-status-audit-trail.component';
import { KycInformationAuditTrailComponent } from './audit-trail/information-audit-trail/kyc-information-audit-trail.component';
import { OfiRedirectTokenComponent } from './invitation-token/redirect-token.component';
import { OfiClientReferentialComponent } from './client-referential/component';
import { OfiFundAccessTable } from './client-referential/access-table/component';
import { OfiLoginModule } from '../ofi-login/module' ;

import { KycRequestsModule } from './my-requests/requests.module';

import { FileDropModule } from '@setl/core-filedrop';
import { FileViewerModule } from '@setl/core-fileviewer';
import { OfiInvMyDocumentsComponent } from './inv-my-documents/component';

import { ConsumeTokenService } from './invitation-token/consume-token.service';

/* Constants */
import config, { kycEnums } from './config';
import { OfiFundDataService } from '../ofi-data-service/product/fund/ofi-fund-data-service';

/* Decorator. */
@NgModule({
    declarations: [
        OfiInviteInvestorsComponent,
        OfiSignUpComponent,
        OfiDocumentsComponent,
        OfiKycHomeComponent,
        OfiWaitingApprovalComponent,
        OfiAmDocumentsComponent,
        OfiKycAlreadyDoneComponent,
        TextInputListComponent,
        OfiInvMyDocumentsComponent,
        OfiRedirectTokenComponent,
        KycAuditTrailComponent,
        KycStatusAuditTrailComponent,
        KycInformationAuditTrailComponent,
        OfiClientReferentialComponent,
        OfiFundAccessTable,
    ],
    exports: [
        OfiInviteInvestorsComponent,
        OfiSignUpComponent,
        OfiDocumentsComponent,
        OfiKycHomeComponent,
        OfiWaitingApprovalComponent,
        OfiAmDocumentsComponent,
        OfiKycAlreadyDoneComponent,
        TextInputListComponent,
        OfiInvMyDocumentsComponent,
        OfiRedirectTokenComponent,
        KycAuditTrailComponent,
        OfiClientReferentialComponent,
        OfiFundAccessTable,
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
        FileViewerModule,
        DpDatePickerModule,
        KycRequestsModule,
        SetlLoginModule,
        OfiLoginModule,
    ],
    providers: [
        MockKYCDocumentsService,
        ToasterService,
        ConsumeTokenService,
        OfiFundDataService,
        { provide: 'endpoints', useValue: config },
        { provide: 'kycEnums', useValue: kycEnums },
    ],
})

/* Class. */
export class OfiKYCModule {

}
