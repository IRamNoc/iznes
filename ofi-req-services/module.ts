import {NgModule} from '@angular/core';
import {OfiFundInvestService} from './ofi-fund-invest/service';
import {OfiCorpActionService} from './ofi-corp-actions/service';

@NgModule({
    exports: [],
    providers: [
        OfiFundInvestService,
        OfiCorpActionService
    ]
})
export class OfiRequestServicesModule {
}
