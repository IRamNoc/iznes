import { Injectable } from '@angular/core';
import { select } from '@angular-redux/store';

import { OfiKycService } from './service';
import { BaseDataService, MyUserService } from '@setl/core-req-services';
import { investorInvitation } from '../../ofi-store/ofi-kyc/invitationsByUserAmCompany/model';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class OfiKycObservablesService extends BaseDataService<OfiKycService> {

    @select(['ofi', 'ofiKyc', 'investorInvitations', 'requested']) investorInvitationsRequested$;
    @select(['ofi', 'ofiKyc', 'investorInvitations', 'data']) investorInvitations$;

    constructor(
        protected _ofiKycService: OfiKycService,
        protected myUserService: MyUserService,
    ) {
        super(_ofiKycService, myUserService);
    }

    onInit() {
        this.setupData(
            'investorInvitations',
            'fetchInvitationsByUserAmCompany',
            this.investorInvitations$,
            this.investorInvitationsRequested$);
    }

    getInvitationData(): Observable<investorInvitation[]> {
        return super.getData<investorInvitation[]>('investorInvitations');
    }
}
