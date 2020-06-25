/* Core/Angular imports. */
import { NgModule } from '@angular/core';
/* Custom Ofi imports. */
import { OfiHomeModule } from './ofi-home/module';
import { OfiAmProductHomeModule } from './ofi-product/module';
import { OfiMyInformationsModule } from './ofi-my-informations/module';
import { OfiKYCModule } from './ofi-kyc/module';
import { OfiFundInvestModule } from './ofi-fund-invest/module';
import { OfiRequestServicesModule } from './ofi-req-services/module';
import { OfiOrdersModule } from './ofi-orders/ofi-orders.module';
import { OfiPostTxService } from './ofi-post-tx/service';
import { OfiProfileModule } from './ofi-profile/module';
import { OfiNavModule } from './ofi-nav/module';
import { OfiReportModule } from './ofi-report-module';
import { OfiAmDashboardModule } from './ofi-am-dashboard/module';
import { MultilingualModule } from '@setl/multilingual';
import {
    SetlDirectivesModule,
    SetlPipesModule,
    DynamicFormsModule,
    SelectModule,
    SetlComponentsModule
} from '@setl/utils';
import { SetlLayoutModule } from '@setl/core-layout';
import { OfiSubPortfolio } from './ofi-sub-portfolio/module'
import { OfiPortfolioManagerModule } from "./ofi-portfolio-manager/portfolio-manager.module";
import { OfiMandateInvestorModule } from './ofi-mandate-investor/mandate-investor.module';

/* Decorator. */
@NgModule({
    imports: [
        OfiHomeModule,
        OfiAmProductHomeModule,
        OfiMyInformationsModule,
        OfiKYCModule,
        OfiFundInvestModule,
        OfiRequestServicesModule,
        OfiOrdersModule,
        OfiProfileModule,
        OfiNavModule,
        OfiReportModule,
        OfiAmDashboardModule,
        SetlComponentsModule,
        MultilingualModule,
        SelectModule,
        DynamicFormsModule,
        SetlLayoutModule,
        SetlDirectivesModule,
        SetlPipesModule,
        OfiSubPortfolio,
        OfiPortfolioManagerModule,
        OfiMandateInvestorModule,
    ],
    exports: [
        OfiFundInvestModule,
        DynamicFormsModule,
    ],
    providers: [OfiPostTxService],
})

/* Class. */
export class OfiMainModule {

}
