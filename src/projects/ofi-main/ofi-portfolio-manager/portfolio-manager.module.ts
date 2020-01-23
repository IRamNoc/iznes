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
import { SetlLayoutModule } from '@setl/core-layout';

import { CircleStatusIndicator } from './circle-status-indicator/circle-status-indicator.component';
import { PortfolioManagerListComponent } from './portfolio-manager-list/portfolio-manager-list.component';
import { PortfolioManagerDetailComponent } from './portfolio-manager-detail/portfolio-manager-detail.component';
import { OfiPortfolioManagerDataService } from '../ofi-data-service/portfolio-manager/ofi-portfolio-manager-data.service';
import { OfiPortfolioMangerService } from '../ofi-req-services/ofi-portfolio-manager/service';
import { OfiMandateInvestorModule } from '../ofi-mandate-investor/mandate-investor.module';
import { PortfolioManagerInviteComponent } from './portfolio-manager-invite/pm-invite.component';

/* Decorator. */
@NgModule({
    declarations: [
        CircleStatusIndicator,
        PortfolioManagerListComponent,
        PortfolioManagerDetailComponent,
        PortfolioManagerInviteComponent,
    ],
    exports: [
        PortfolioManagerListComponent,
        PortfolioManagerDetailComponent,
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
        OfiMandateInvestorModule,
    ],
    providers: [
        OfiPortfolioMangerService,
        OfiPortfolioManagerDataService,
    ],
})

/* Class. */
export class OfiPortfolioManagerModule {
}
