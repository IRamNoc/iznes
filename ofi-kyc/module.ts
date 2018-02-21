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
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
import {KycUserDetailsComponent} from './kyc-user-details/component';
import {OfiWaitingApprovalComponent} from './waiting-approval/component';
>>>>>>> Stashed changes
=======
import {TextInputListComponent} from './text-input-list/component';
>>>>>>> 284d93d... TG-266 feat(ofi-kyc): added basic user details presentational component

/* Decorator. */
@NgModule({
    declarations: [
        OfiInviteInvestorsComponent,
        OfiSignUpComponent,
        OfiDocumentsComponent,
        OfiKycHomeComponent,
<<<<<<< HEAD
<<<<<<< Updated upstream

=======
        KycUserDetailsComponent,
        OfiWaitingApprovalComponent
>>>>>>> Stashed changes
=======
        TextInputListComponent,
>>>>>>> 284d93d... TG-266 feat(ofi-kyc): added basic user details presentational component
    ],
    exports: [
        OfiInviteInvestorsComponent,
        OfiSignUpComponent,
        OfiDocumentsComponent,
        OfiKycHomeComponent,
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
        KycUserDetailsComponent,
        OfiWaitingApprovalComponent,
>>>>>>> Stashed changes
=======
        TextInputListComponent,
>>>>>>> 284d93d... TG-266 feat(ofi-kyc): added basic user details presentational component
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
