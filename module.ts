import {NgModule} from '@angular/core';

import {OfiFundInvestModule} from './ofi-fund-invest/module';
import {OfiRequestServicesModule} from './ofi-req-services/module';

@NgModule({
    imports: [OfiFundInvestModule, OfiRequestServicesModule],
    exports: [OfiFundInvestModule],
    declarations: [],
    providers: []
})
export class OfiMainModule {
}

