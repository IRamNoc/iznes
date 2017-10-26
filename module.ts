/* Core/Angular imports. */
import {NgModule} from '@angular/core';

/* Custom Ofi imports. */
import {OfiHomeModule} from './ofi-home/module';
import {OfiFundInvestModule} from './ofi-fund-invest/module';
import {OfiRequestServicesModule} from './ofi-req-services/module';
import {OfiCorpActionsModule} from './ofi-corp-actions/ofi-corp-actions.module';
import {OfiOrdersModule} from './ofi-orders/ofi-orders.module';
import {OfiPostTxService} from './ofi-post-tx/service';
import {OfiNavModule} from './ofi-nav/module';
import {OfiReportModule} from './ofi-report-module';
import {OfiAmDashboardModule} from './ofi-am-dashboard/module'
import {MultilingualModule} from '@setl/multilingual';

/* Decorator. */
@NgModule({
    imports: [
        OfiHomeModule,
        OfiFundInvestModule,
        OfiCorpActionsModule,
        OfiRequestServicesModule,
        OfiOrdersModule,
        OfiNavModule,
        OfiReportModule,
        OfiAmDashboardModule,
        MultilingualModule
    ],
    exports: [
        OfiFundInvestModule,
        OfiCorpActionsModule
    ],
    declarations: [],
    providers: [OfiPostTxService]
})

/* Class. */
export class OfiMainModule {

}
