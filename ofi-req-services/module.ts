import {NgModule} from '@angular/core';
import {OfiFundInvestService} from './ofi-fund-invest/service';
import {OfiManagementCompanyService} from './ofi-product/management-company/management-company.service';

import {OfiCorpActionService} from './ofi-corp-actions/service';
import {OfiMemberNodeChannelService} from './ofi-member-node-channel/service';

@NgModule({
    exports: [],
    providers: [
        OfiFundInvestService,
        OfiCorpActionService,
        OfiMemberNodeChannelService,
        OfiManagementCompanyService
    ]
})

export class OfiRequestServicesModule {
}
