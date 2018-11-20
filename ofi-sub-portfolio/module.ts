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
import { OfiSubPortfolioComponent } from './sub-portfolio/component';
import { SetlLayoutModule } from '@setl/core-layout';

import { OfiFundInvestModule } from '@ofi/ofi-main/ofi-fund-invest/module';
import { OfiOrdersModule } from '@ofi/ofi-main/ofi-orders/ofi-orders.module';

/* Decorator. */
@NgModule({
    declarations: [
        OfiSubPortfolioComponent,
    ],
    exports: [
        OfiSubPortfolioComponent,
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
        OfiFundInvestModule,
        OfiOrdersModule,
    ],
    providers: [],
})

/* Class. */
export class OfiSubPortfolio {
}
