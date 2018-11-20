import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, NumberConverterService, LogService } from '@setl/utils';
import { NgRedux } from '@angular-redux/store';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';

import {
    SET_PRODUCT_CONFIGURATION,
    SET_REQUESTED_CONFIGURATION,
    CLEAR_REQUESTED_CONFIGURATION,
    setRequestedConfiguration,
    clearRequestedConfiguration,
} from '@ofi/ofi-main/ofi-store/ofi-product';

import { GetProductConfigRequestBody, UpdateProductConfigRequestBody } from './model';

@Injectable()
export class OfiProductConfigService {

    constructor(private memberSocketService: MemberSocketService,
                private logService: LogService,
                private numberService: NumberConverterService,
    ) {
    }

    static defaultRequestProductConfig(ofiFundService: OfiProductConfigService,
                                       ngRedux: NgRedux<any>) {
        ngRedux.dispatch(setRequestedConfiguration());

        const asyncTaskPipe = ofiFundService.requestProductConfig();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_PRODUCT_CONFIGURATION],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /**
     * Request product configuration
     * @return {any}
     */
    requestProductConfig(): any {
        const messageBody: GetProductConfigRequestBody = {
            RequestName: 'getproductconfig',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    static defaultUpdateProductConfig(ofiFundService: OfiProductConfigService,
                                      ngRedux: NgRedux<any>,
                                      name: string,
                                      value: string,
                                      successCallback: (data: any) => void,
                                      errorCallback: (e: any) => void) {
        const asyncTaskPipe = ofiFundService.updateProductConfig(name, value);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_PRODUCT_CONFIGURATION],
            [],
            asyncTaskPipe,
            {},
            (data: any) => successCallback(data),
            (e: any) => errorCallback(e),
        ));
    }

    /**
    * Update product configuration
    * @param name string
    * @param value string
    * @return {any}
    */
    updateProductConfig(name: string, value: string): void {
        const messageBody: UpdateProductConfigRequestBody = {
            name,
            value,
            RequestName: 'updateproductconfig',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
