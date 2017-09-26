import {NgModule} from '@angular/core';
import {OfiFundInvestService} from './ofi-fund-invest/service';

@NgModule({
    exports: [OfiFundInvestService],
    providers: [OfiFundInvestService]
})
export class OfiRequestServicesModule {
}
