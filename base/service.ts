import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { SagaHelper } from '@setl/utils';

@Injectable()
export class AccountAdminBaseService {
    constructor(private redux: NgRedux<any>) {}

    /**
     * Make API Call
     *
     * @param asyncTaskPipe
     * @param setRequestedMethod
     * @param successType
     * @param successCallback
     * @param errorCallback
     */
    protected callAccountAdminAPI(asyncTaskPipe: { [key: string]: any },
                                  setRequestedMethod: () => any,
                                  successType: any,
                                  successCallback: (data) => void,
                                  errorCallback: (e) => void): void {

        this.redux.dispatch(SagaHelper.runAsync(
            [successType],
            [],
            asyncTaskPipe,
            {},
            (data) => {
                successCallback(data);
                if (setRequestedMethod) this.redux.dispatch(setRequestedMethod());
            },
            errorCallback,
        ));
    }

}
