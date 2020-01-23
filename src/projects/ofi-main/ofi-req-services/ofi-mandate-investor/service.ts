import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest, createMemberNodeRequest } from '@setl/utils/common';
import { SagaHelper } from '@setl/utils';

import {
    OFI_SET_MANDATE_INVESTOR_LIST,
    ofiMandateInvestorsRequested
} from '../../ofi-store/ofi-mandate-investor';

@Injectable({ providedIn: 'root' })
export class OfiMandateInvestorService {

    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {}

    defaultList() {
        this.ngRedux.dispatch(ofiMandateInvestorsRequested());

        const asyncTaskPipe = this.list();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_MANDATE_INVESTOR_LIST],
            [],
            asyncTaskPipe,
             {},
        ));
    }

    list() {
        const messageBody = {
            RequestName: 'iznmandateinvestorlist',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    createInvestor(investorType: number, firstName: string, lastName: string, reference: string, companyName?: string) {
        const messageBody = {
            RequestName: 'iznmandateinvestorcreate',
            token: this.memberSocketService.token,
            investorType,
            firstName,
            lastName,
            reference,
            companyName
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }
}
