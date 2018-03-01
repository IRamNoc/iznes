import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {createMemberNodeSagaRequest} from '@setl/utils/common';

import {
    AmAllFundShareListRequestBody
} from './model';
import {
    SET_AM_ALL_FUND_SHARE_LIST,
    setRequestedAmAllFundShare,
    clearRequestedAmAllFundShare
} from '../../../ofi-store/ofi-product/fundshare/actions';

@Injectable()
export class OfiFundShareService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    static defaultRequestAmAllFundShareList(ofiFundService: OfiFundShareService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedAmAllFundShare());

        // Request the list.
        const asyncTaskPipe = ofiFundService.requestAmAllFundShareList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_AM_ALL_FUND_SHARE_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    requestAmAllFundShareList(): any {
        const messageBody: AmAllFundShareListRequestBody = {
            RequestName: 'getfundstatus',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
