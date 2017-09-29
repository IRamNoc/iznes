import {NgModule} from '@angular/core';
import {OfiFundInvestService} from './ofi-fund-invest/service';
import {OfiManagementCompanyService} from './ofi-product/management-company/management-company.service';

import {OfiCorpActionService} from './ofi-corp-actions/service';

@NgModule({
    exports: [],
    providers: [
        OfiFundInvestService,
        OfiCorpActionService,
        OfiManagementCompanyService
    ]
})

export class OfiRequestServicesModule {
}
