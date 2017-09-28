import {NgModule} from '@angular/core';

import {OfiFundInvestModule} from './ofi-fund-invest/module';
import {OfiRequestServicesModule} from './ofi-req-services/module';
import {OfiCorpActionsModule} from './ofi-corp-actions/ofi-corp-actions.module';

@NgModule({
    imports: [
        OfiFundInvestModule,
        OfiCorpActionsModule
    ],
    exports: [
        OfiFundInvestModule,
        OfiCorpActionsModule
    ],
    declarations: [

    ],
    providers: [
        OfiRequestServicesModule
    ]
})
export class OfiMainModule {
}
