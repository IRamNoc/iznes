import {NgModule} from '@angular/core';
import {OfiFundInvestService} from './ofi-fund-invest/service';
import {OfiCorpActionService} from './ofi-corp-actions/service';
import {OfiMemberNodeChannelService} from './ofi-member-node-channel/service';

@NgModule({
    exports: [],
    providers: [
        OfiFundInvestService,
        OfiCorpActionService,
        OfiMemberNodeChannelService
    ]
})
export class OfiRequestServicesModule {
}
