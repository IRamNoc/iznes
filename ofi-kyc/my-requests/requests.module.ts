import {NgModule} from '@angular/core';

// Common Imports
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule, SetlComponentsModule, SetlDirectivesModule, SetlPipesModule, DpDatePickerModule} from '@setl/utils';
import {ClarityModule} from '@clr/angular';
import {FileDropModule} from '@setl/core-filedrop';
//

import {MyRequestsContainerComponent} from './my-requests-container.component';
import {MyRequestsComponent} from './list/my-requests.component';
import {MyRequestComponent} from './list/my-request.component';
import {MyRequestsGridComponent} from './list/list-grid.component';
import {NewKycRequestComponent} from './request/new-request.component';
import {NewKycSelectAmcComponent} from './request/steps/select-amc.component';
import {NewKycIntroductionComponent} from './request/steps/introduction.component';
import {NewKycIdentificationComponent} from './request/steps/identification.component';
import {GeneralInformationComponent} from './request/steps/identification/general-information.component';
import {CompanyInformationComponent} from './request/steps/identification/company-information.component';
import {BankingInformationComponent} from './request/steps/identification/banking-information.component';
import {ClassificationInformationComponent} from './request/steps/identification/classification-information.component';

import {RequestsService} from './requests.service';
import {NewRequestService} from './request/new-request.service';
import {IdentificationService} from './request/steps/identification.service';
import {RequestsRoutingModule} from './requests-routing.module';

@NgModule({
    imports : [
        ClarityModule,
        SelectModule,
        SetlPipesModule,
        SetlComponentsModule,
        SetlDirectivesModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FileDropModule,
        DpDatePickerModule,
        RequestsRoutingModule
    ],
    declarations : [
        MyRequestsContainerComponent,
        MyRequestsComponent,
        MyRequestComponent,
        MyRequestsGridComponent,

        NewKycRequestComponent,
        NewKycSelectAmcComponent,
        NewKycIntroductionComponent,
        NewKycIdentificationComponent,

        GeneralInformationComponent,
        CompanyInformationComponent,
        BankingInformationComponent,
        ClassificationInformationComponent,
    ],
    providers : [
        RequestsService,
        NewRequestService,
        IdentificationService
    ]
})

export class KycRequestsModule{}