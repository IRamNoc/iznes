import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { runAsync } from '@setl/utils/sagaHelper';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { BaseUserPreferenceRequestBody, SaveUserPreferenceRequestBody } from './model';
import { NgRedux } from '@angular-redux/store';

@Injectable()
export class UserPreferenceService {

    constructor(private memberSocketService: MemberSocketService, private ngRedux: NgRedux<any>) {
    }

    /**
     * Save/Updates a User Preference
     * ------------------------------
     * @param {object} data
     * @param {array} reduxSuccessActions
     * @param {array} reduxFailActions
     * @return {promise} buildRequest
     */
    public saveUserPreference(data: any, reduxSuccessActions?: any[], reduxFailActions?: any[]): any {
        const messageBody: SaveUserPreferenceRequestBody = {
            RequestName: 'newuserpreference',
            token: this.memberSocketService.token,
            key: data.key,
            value: data.value,
            walletId: data.walletId || 0,
        };

        return this.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            successActions: reduxSuccessActions || '',
            failActions: reduxFailActions || '',
        });
    }

    /**
     * Gets a Users Preferences
     * ------------------------
     * @param {object} data
     * @param {array} reduxSuccessActions
     * @param {array} reduxFailActions
     * @return {promise} buildRequest
     */
    public getUserPreference(data: any, reduxSuccessActions?: any[], reduxFailActions?: any[]): any {
        const messageBody: BaseUserPreferenceRequestBody = {
            RequestName: 'getuserpreference',
            token: this.memberSocketService.token,
            key: data.key,
            walletId: data.walletId || 0,
        };

        return this.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            successActions: reduxSuccessActions || '',
            failActions: reduxFailActions || '',
        });
    }

    /**
     * Deletes a User Preference
     * -------------------------
     * @param {object} data
     * @param {array} reduxSuccessActions
     * @param {array} reduxFailActions
     * @return {promise} buildRequest
     */
    public deleteUserPreference(data: any, reduxSuccessActions?: any[], reduxFailActions?: any[]): any {
        const messageBody: BaseUserPreferenceRequestBody = {
            RequestName: 'deleteuserpreference',
            token: this.memberSocketService.token,
            key: data.key,
            walletId: data.walletId || 0,
        };

        return this.buildRequest({
            ngRedux: this.ngRedux,
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            successActions: reduxSuccessActions || '',
            failActions: reduxFailActions || '',
        });
    }

    /**
     * Dispatches a MemberNode Saga Request
     * ------------------------------------
     * @param {object} request
     * @return {promise} buildRequest
     */
    public buildRequest(request: any): any {
        if (!request.taskPipe) {
            return;
        }

        return new Promise((resolve, reject) => {
            request.ngRedux.dispatch(
                runAsync(
                    request.successActions || [],
                    request.failActions || [],
                    request.taskPipe,
                    {},
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        reject(error);
                    },
                ),
            );
        });
    }
}
