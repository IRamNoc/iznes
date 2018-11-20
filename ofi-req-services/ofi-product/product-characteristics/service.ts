import { Injectable, OnDestroy } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { NgRedux, select } from '@angular-redux/store';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import { SagaHelper } from '@setl/utils';
import { Location } from '@angular/common';
import {
    ProductCharacteristicsRequestBody,
} from './model';
import {
    SET_PRODUCT_CHARACTERISTICS,
    SET_REQUESTED_PRODUCT_CHARACTERISTICS,
} from '@ofi/ofi-main/ofi-store/ofi-product';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { List } from 'immutable';
import * as _ from 'lodash';

@Injectable()
export class ProductCharacteristicsService implements OnDestroy {
    productList = List();

    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiProduct', 'ofiProductCharacteristics', 'productList']) productList$;

    constructor(
        private memberSocketService: MemberSocketService,
        private location: Location,
        private ngRedux: NgRedux<any>,
    ) {
        this.productList$.pipe(
            takeUntil(this.unSubscribe))
            .subscribe((d) => {
                if (!d) {
                    return;
                }
                this.productList = d;
            });
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

    getProductCharacteristics(isin: string) {

        if (this.productList.includes(isin)) {
            return;
        }
        this.fetchProductCharacteristics(isin);
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
            (res) => {
                if (!res[1].Data.length) {
                    this.location.back();
                    return;
                }
                this.ngRedux.dispatch({
                    type: SET_REQUESTED_PRODUCT_CHARACTERISTICS,
                });
            },
        ));
    }
}
