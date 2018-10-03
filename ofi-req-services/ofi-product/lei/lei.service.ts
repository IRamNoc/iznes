import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { SagaHelper } from '@setl/utils';
import {
    setLeiList,
    SET_REQUESTED_LEI,
} from '../../../ofi-store/ofi-product/lei';

@Injectable()
export class LeiService {
    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {

    }

    fetchLEIs() {
        const messageBody = {
            RequestName: 'izngetleis',
            token: this.memberSocketService.token,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_REQUESTED_LEI],
            [],
            asyncTaskPipe,
            {},
            (res) => {
                this.ngRedux.dispatch(setLeiList(res));
            },
        ));
    }
}
