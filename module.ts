import {NgModule} from '@angular/core';

import {OfiFundInvestModule} from './ofi-fund-invest/module';
import {OfiRequestServicesModule} from './ofi-req-services/module';
import {OfiCorpActionsModule} from './ofi-corp-actions/ofi-corp-actions.module';
import {OfiOrdersModule} from './ofi-orders/ofi-orders.module';

@NgModule({
    imports: [
        OfiFundInvestModule,
        OfiCorpActionsModule,
        OfiRequestServicesModule,
        OfiOrdersModule
    ],
    exports: [
        OfiFundInvestModule,
        OfiCorpActionsModule
    ],
    declarations: [],
    providers: []
})
export class OfiMainModule {
}
