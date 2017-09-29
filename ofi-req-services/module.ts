import {NgModule} from '@angular/core';
import {OfiFundInvestService} from './ofi-fund-invest/service';
import {OfiManagementCompanyService} from './ofi-product/management-company/management-company.service';

@NgModule({
    exports: [],
    providers: [OfiFundInvestService, OfiManagementCompanyService]
})
export class OfiRequestServicesModule {
}
