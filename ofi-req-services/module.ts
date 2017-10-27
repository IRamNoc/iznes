import {NgModule} from '@angular/core';
import {OfiFundInvestService} from './ofi-fund-invest/service';
import {ArrangementType} from './ofi-fund-invest/model';
import {OfiManagementCompanyService} from './ofi-product/management-company/management-company.service';
import {OfiSicavService} from './ofi-product/sicav/sicav.service';
import {OfiFundService} from './ofi-product/fund/fund.service';
import {OfiNavService} from './ofi-product/nav/service';
import {OfiAmDashboardService} from './ofi-am-dashboard/service';

import {OfiCorpActionService} from './ofi-corp-actions/service';
import {OfiMemberNodeChannelService} from './ofi-member-node-channel/service';

@NgModule({
    exports: [],
    providers: [
        OfiFundInvestService,
        OfiCorpActionService,
        OfiMemberNodeChannelService,
        OfiManagementCompanyService,
        OfiSicavService,
        OfiFundService,
        OfiNavService,
        OfiAmDashboardService
    ]
})

export class OfiRequestServicesModule {
}

export {ArrangementType};
