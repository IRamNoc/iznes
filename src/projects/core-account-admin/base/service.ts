import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import * as moment from 'moment-timezone';
import { SagaHelper, FileDownloader } from '@setl/utils';

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

    /**
     * Get a CSV export
     *
     * @param service FileDownloader
     * @param request
     * @param method
     * @param token
     * @param userId needed by the file downloader
     * @param userName needed by the file downloader
     * @param type needed by the file downloader
     */
    getCSVExport(service: FileDownloader,
                 request: any,
                 method: string,
                 token: string,
                 userId: number,
                 userName: string,
                 type: string): void {
        service.downLoaderFile({
            ...request,
            method,
            token,
            userId,
            userName,
            type,
            timezone: moment.tz.guess(),
        });
    }
}
