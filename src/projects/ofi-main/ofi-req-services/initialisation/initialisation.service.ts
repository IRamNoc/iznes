import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';
import { clearRequestedClientTxList } from '../../ofi-store/ofi-client-txs/ofi-client-tx-list/actions';

@Injectable()
export class OfiInitialisationService {
    constructor() {
    }

    static clearMemberNodeRequestedStatesOnNewBlock(ngRedux: NgRedux<any>): void {
        ngRedux.dispatch(clearRequestedClientTxList());
    }
}
