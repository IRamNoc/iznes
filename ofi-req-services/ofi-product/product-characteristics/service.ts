import { Injectable, OnDestroy } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { NgRedux, select } from '@angular-redux/store';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import { SagaHelper } from '@setl/utils';
import {
    ProductCharacteristicsRequestBody,
} from './model';
import {
    SET_PRODUCT_CHARACTERISTICS,
    SET_REQUESTED_PRODUCT_CHARACTERISTICS,
} from '@ofi/ofi-main/ofi-store/ofi-product';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Injectable()
export class ProductCharacteristicsService implements OnDestroy {

    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofi-product', 'product-characteristics', 'requested']) productCharacteristicsRequested$;

    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {

    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

    getProductCharacteristics(isin: string) {

        this.productCharacteristicsRequested$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (d) {
                    return;
                }
                this.fetchProductCharacteristics(isin);
            });

    }

    fetchProductCharacteristics(isin: string) {
        const messageBody: ProductCharacteristicsRequestBody = {
            RequestName: 'getProductCharacteristics',
            token: this.memberSocketService.token,
            isin,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_PRODUCT_CHARACTERISTICS],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch({
                    type: SET_REQUESTED_PRODUCT_CHARACTERISTICS,
                });
            },
        ));
    }
}
