import {NgModule} from '@angular/core';

import {OfiFundInvestModule} from './ofi-fund-invest/module';
import {OfiRequestServicesModule} from './ofi-req-services/module';
import {OfiCorpActionsModule} from './ofi-corp-actions/ofi-corp-actions.module';
import {OfiOrdersModule} from './ofi-orders/ofi-orders.module';
import {OfiPostTxService} from './ofi-post-tx/service';
import {OfiNavModule} from './ofi-nav/module';

@NgModule({
    imports: [
        OfiFundInvestModule,
        OfiCorpActionsModule,
        OfiRequestServicesModule,
        OfiOrdersModule,
        OfiNavModule
    ],
    exports: [
        OfiFundInvestModule,
        OfiCorpActionsModule
    ],
    declarations: [],
    providers: [OfiPostTxService]
})
export class OfiMainModule {
}
