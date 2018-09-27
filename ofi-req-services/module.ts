import { NgModule } from '@angular/core';
import { OfiCurrenciesService } from './ofi-currencies/service';
import { OfiFundInvestService } from './ofi-fund-invest/service';
import { ArrangementType } from './ofi-fund-invest/model';
import { OfiProductConfigService } from './ofi-product/configuration/service';
import { OfiManagementCompanyService } from './ofi-product/management-company/management-company.service';
import { OfiSicavService } from './ofi-product/sicav/sicav.service';
import { OfiFundService } from './ofi-product/fund/fund.service';
import { OfiUmbrellaFundService } from './ofi-product/umbrella-fund/service';
import { OfiFundShareService } from './ofi-product/fund-share/service';
import { OfiNavService } from './ofi-product/nav/service';
import { OfiClientTxService } from './ofi-client-tx/service';
import { OfiWalletnodeChannelService } from './ofi-walletnode-channel/service';
import { OfiAmDashboardService } from './ofi-am-dashboard/service';
import { OfiKycService } from './ofi-kyc/service';
import { OfiReportsService } from './ofi-reports/service';

import { OfiCorpActionService } from './ofi-corp-actions/service';
import { OfiMemberNodeChannelService } from './ofi-member-node-channel/service';
import { OfiSubPortfolioService } from './ofi-sub-portfolio/service';

@NgModule({
    exports: [],
    providers: [
        OfiCurrenciesService,
        OfiFundInvestService,
        OfiCorpActionService,
        OfiMemberNodeChannelService,
        OfiProductConfigService,
        OfiManagementCompanyService,
        OfiSicavService,
        OfiFundService,
        OfiUmbrellaFundService,
        OfiFundShareService,
        OfiNavService,
        OfiClientTxService,
        OfiWalletnodeChannelService,
        OfiAmDashboardService,
        OfiKycService,
        OfiReportsService,
        OfiSubPortfolioService,
    ],
})

export class OfiRequestServicesModule {
}

export { ArrangementType };
