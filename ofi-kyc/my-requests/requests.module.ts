import { NgModule } from '@angular/core';

// Common Imports
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    SelectModule,
    SetlComponentsModule,
    SetlDirectivesModule,
    SetlPipesModule,
    DpDatePickerModule,
} from '@setl/utils';
import { ClarityModule } from '@clr/angular';
import { FileDropModule } from '@setl/core-filedrop';
import { FileViewerModule } from '@setl/core-fileviewer';
import { PersistModule } from '@setl/core-persist';

import { KycDetailsComponent } from './kyc-details/details.component';
import { KycDetailsGridComponent } from './kyc-details/details-grid.component';
import { KycDetailsStakeholdersComponent } from './kyc-details/beneficiaries.component';
import { KycDetailsStakeholdersModalComponent } from './kyc-details/beneficiary-modal.component';

import { MyRequestsContainerComponent } from './my-requests-container.component';
import { MyRequestsComponent } from './list/my-requests.component';
import { MyRequestsGridComponent } from './list/list-grid.component';
import { NewKycRequestComponent } from './request/new-request.component';
import { NewKycSelectAmcComponent } from './request/steps/select-amc.component';

import { MyRequestsDetailsComponent } from './list/request-details/component';

import { NewKycIntroductionComponent } from './request/steps/introduction.component';

import { NewKycIdentificationComponent } from './request/steps/identification.component';
import { GeneralInformationComponent } from './request/steps/identification/general-information.component';
import { CompanyInformationComponent } from './request/steps/identification/company-information.component';
import { BeneficiaryListComponent } from './request/steps/identification/beneficiary-list.component';
import { BeneficiaryLineComponent } from './request/steps/identification/beneficiary-line.component';
import { BeneficiaryComponent } from './request/steps/identification/beneficiary.component';
import { BankingInformationComponent } from './request/steps/identification/banking-information.component';
import { ClassificationInformationComponent } from './request/steps/identification/classification-information.component';

import { NewKycRiskProfileComponent } from './request/steps/risk-profile.component';
import { InvestmentNatureComponent } from './request/steps/risk-profile/investment-nature.component';
import { InvestmentNatureFormComponent } from './request/steps/risk-profile/investment-nature-form.component';
import { InvestmentObjectiveComponent } from './request/steps/risk-profile/investment-objective.component';
import { InvestmentObjectiveFormComponent } from './request/steps/risk-profile/investment-objective-form.component';
import { InvestmentConstraintComponent } from './request/steps/risk-profile/investment-constraint.component';
import { InvestmentConstraintFormComponent } from './request/steps/risk-profile/investment-constraint-form.component';

import { NewKycDocumentsComponent } from './request/steps/documents.component';

import { NewKycValidationComponent } from './request/steps/validation.component';

import { RequestsService } from './requests.service';
import { NewRequestService } from './request/new-request.service';
import { SelectAmcService } from './request/steps/select-amc.service';
import { IdentificationService } from './request/steps/identification.service';
import { RiskProfileService } from './request/steps/risk-profile.service';
import { DocumentsService } from './request/steps/documents.service';
import { ValidationService } from './request/steps/validation.service';

@NgModule({
    declarations: [
        MyRequestsContainerComponent,
        MyRequestsComponent,
        MyRequestsGridComponent,
        MyRequestsDetailsComponent,

        NewKycRequestComponent,
        NewKycSelectAmcComponent,

        NewKycIntroductionComponent,

        NewKycIdentificationComponent,
        GeneralInformationComponent,
        CompanyInformationComponent,
        BeneficiaryListComponent,
        BeneficiaryLineComponent,
        BeneficiaryComponent,
        BankingInformationComponent,
        ClassificationInformationComponent,

        NewKycRiskProfileComponent,
        InvestmentNatureComponent,
        InvestmentNatureFormComponent,
        InvestmentObjectiveComponent,
        InvestmentObjectiveFormComponent,
        InvestmentConstraintComponent,
        InvestmentConstraintFormComponent,

        NewKycDocumentsComponent,

        NewKycValidationComponent,

        KycDetailsComponent,
        KycDetailsGridComponent,
        KycDetailsStakeholdersComponent,
        KycDetailsStakeholdersModalComponent,
    ],
    exports: [
        KycDetailsComponent,
        KycDetailsGridComponent,
    ],
    imports: [
        ClarityModule,
        SelectModule,
        SetlPipesModule,
        SetlComponentsModule,
        SetlDirectivesModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FileDropModule,
        FileViewerModule,
        DpDatePickerModule,
        PersistModule,
        RouterModule,
    ],
    providers: [
        RequestsService,
        NewRequestService,
        SelectAmcService,
        IdentificationService,
        RiskProfileService,
        DocumentsService,
        ValidationService,
    ],
})

export class KycRequestsModule {
}
