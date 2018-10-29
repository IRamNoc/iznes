import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import {
    RequestNavListMessageBody,
    RequestBasicMessageBody,
} from './model';
import { SagaHelper, Common } from '@setl/utils';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { NgRedux } from '@angular-redux/store';
import * as _ from 'lodash';

import {
    SET_WORKFLOW_LIST,
    setRequestedWorkflowList,
} from '@setl/core-store';

@Injectable()
export class CoreWorkflowEngineService {
    constructor(private memberSocketService: MemberSocketService) {
    }

    /**
     * Default static call to get nav list, and dispatch default actions, and other
     * default task.
     *
     * @param ofiNavService
     * @param ngRedux
     * @param requestData
     */
    static defaultRequestNavList(ofiNavService: CoreWorkflowEngineService, ngRedux: NgRedux<any>, requestData: any) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedWorkflowList());

        // Request the list.
        const asyncTaskPipe = ofiNavService.requestNavList(requestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WORKFLOW_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    requestNavList(requestData: any): any {
        const messageBody: RequestNavListMessageBody = {
            RequestName: 'getNavList',
            token: this.memberSocketService.token,
            fundName: _.get(requestData, 'fundName', ''),
            navDate: _.get(requestData, 'navDate', ''),
            status: _.get(requestData, 'status', 0),
            pageNum: _.get(requestData, 'pageNum', 0),
            pageSize: _.get(requestData, 'pageSize', 1000),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestBasic(requestData = {}): any {
        const messageBody: RequestBasicMessageBody = {
            RequestName: 'wfe-basic-get',
            token: this.memberSocketService.token,
            data: requestData,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestNew(requestData = {}): any {
        const messageBody: RequestBasicMessageBody = {
            RequestName: 'wfe-basic-new',
            token: this.memberSocketService.token,
            data: requestData,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getConfiguration (request = {}) {
        const messageBody = {
            RequestName: 'wfe-edit-configuration',
            token: this.memberSocketService.token,
            data: request,
        };
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestTemplateList(data = {}): any {
        const messageBody = {
            RequestName: 'wfe-edit-list',
            token: this.memberSocketService.token,
            data: data,
        };
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestTemplateLoad(request = {}): any {
        const messageBody = {
            RequestName: 'wfe-edit-load',
            token: this.memberSocketService.token,
            data: request,
        };
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestTemplateSave(request = {}): any {
        const messageBody = {
            RequestName: 'wfe-edit-save',
            token: this.memberSocketService.token,
            data: request,
        };
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestTemplateRename(request = {}): any {
        const messageBody = {
            RequestName: 'wfe-edit-rename',
            token: this.memberSocketService.token,
            data: request,
        };
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getReport(request = {}): any {
        const messageBody = {
            RequestName: 'wfe-ops-report',
            token: this.memberSocketService.token,
            data: request,
        };
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    walletNodeQuery(request = {}): any {
        const messageBody = {
            RequestName: 'wfe-chain-msg',
            token: this.memberSocketService.token,
            data: request,
        };
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
