import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {RequetFundAccessMy} from './model';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {NgRedux} from '@angular-redux/store';

import {setRequestedFundAccessMy, SET_FUND_ACCESS_MY} from '../../ofi-store/ofi-fund-invest';

@Injectable()
export class OfiFundInvestService {
    constructor(private memberSocketService: MemberSocketService) {
        console.log(this.memberSocketService);
    }

    /**
     * Default static call to get my fund access, and dispatch default actions, and other
     * default task.
     *
     * @param ofiFundInvestService
     * @param ngRedux
     */
    static defaultRequestFunAccessMy(ofiFundInvestService: OfiFundInvestService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedFundAccessMy());

        // Request the list.
        const asyncTaskPipe = ofiFundInvestService.requestFundAccessMy();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_FUND_ACCESS_MY],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    requestFundAccessMy(): any {
        const messageBody: RequetFundAccessMy = {
            RequestName: 'gfamy',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
