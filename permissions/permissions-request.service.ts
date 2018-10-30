import { RequestPermissionListMessageBody } from './permissions-request.service.model';
import { NgRedux } from '@angular-redux/store';
import * as SagaHelper from '@setl/utils/sagaHelper';
import { MemberSocketService } from '@setl/websocket-service';
import { Injectable } from '@angular/core';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { SET_PERMISSIONS_LIST } from '@setl/core-store/user';
import * as _ from 'lodash';

@Injectable()
export class PermissionsRequestService {

    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {
        /* Stub. */
    }
    /**
     * Get User Admin Permissions and store them
     *
     * @param {object} params  Parameters
     *
     * @returns {void}
     */
    public getUserAdminPermissions(params) {
        const asyncTaskPipe = this.requestUserAdminPermissions(params);
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_PERMISSIONS_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /**
     * Request User Permissions
     *
     * @param {object} params Parameters
     *
     * @returns {Promise<any>}
     */
    public requestUserAdminPermissions(params) {
        const messageBody: RequestPermissionListMessageBody = {
            RequestName: 'guap',
            token: this.memberSocketService.token,
            userId: _.get(params, 'userID', null),
            permissionName: _.get(params, 'permissionName', null),
        };
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
