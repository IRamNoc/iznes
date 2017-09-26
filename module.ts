import {NgModule} from '@angular/core';

import {OfiFundInvestModule} from './ofi-fund-invest/module';
import {OfiRequestServicesModule} from './ofi-req-services/module';

@NgModule({
    imports: [OfiFundInvestModule],
    exports: [OfiFundInvestModule],
    declarations: [],
    providers: [OfiRequestServicesModule]
})
export class OfiMainModule {
}

