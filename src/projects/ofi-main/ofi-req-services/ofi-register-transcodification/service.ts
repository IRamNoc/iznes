import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { MemberSocketService } from '@setl/websocket-service';

import {
    IznesGetRegisterTranscofificationRequestBody,
    IznesGetThirdPartiesRequestBody,
    IznesUpdateRegisterTranscofification,
    IznesUpdateRegisterTranscofificationRequestBody,
    IznesDeleteRegisterTranscofificationRequestBody,
    IznesCreateRegisterTranscofificationRequestBody,
    IznesCreateRegisterTranscofification,
    
} from './model';

import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';

import * as _ from 'lodash';
import { SagaHelper } from '@setl/utils';


import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

@Injectable()
export class OfiRegisterTranscodificationService {
    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {}

    defaultRequestListThirdParties(successCallback: (res) => void, errorCallback: (res) => void) {
        // Request the list
        const asyncTaskPipe = this.requestThirdPartiesList();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            res => successCallback(res),
            res => errorCallback(res),
        ));
    }

    requestThirdPartiesList(): any {
        const messageBody: IznesGetThirdPartiesRequestBody = {
          RequestName: 'izngetthirdparties',
          token: this.memberSocketService.token,
        };
    
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
    
    defaultRequestListRegisterTranscodification(kycId: number, successCallback: (res) => void, errorCallback: (res) => void) {
        // Request the list.
        const asyncTaskPipe = this.requestRegisterTranscodificationList(kycId);
    
        this.ngRedux.dispatch(SagaHelper.runAsync(
          [],
          [],
          asyncTaskPipe,
          {},
          res => successCallback(res),
          res => errorCallback(res),
        ));
    }
    
    requestRegisterTranscodificationList(kycId: number): any {
        const messageBody: IznesGetRegisterTranscofificationRequestBody = {
          RequestName: 'izngetregistertranscodification',
          token: this.memberSocketService.token,
          kycId,
        };
    
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    defaultRequestUpdateRegisterTranscodification(data: IznesUpdateRegisterTranscofification, successCallback: (res) => void, errorCallback: (res) => void) {
        // Request the list.
        const asyncTaskPipe = this.requestRegisterTranscodificationUpdate(data);
    
        this.ngRedux.dispatch(SagaHelper.runAsync(
          [],
          [],
          asyncTaskPipe,
          {},
          res => successCallback(res),
          res => errorCallback(res),
        ));
    }
    
    requestRegisterTranscodificationUpdate(data: IznesUpdateRegisterTranscofification): any {
        const messageBody: IznesUpdateRegisterTranscofificationRequestBody = {
          RequestName: 'iznupdateregistertranscodification',
          token: this.memberSocketService.token,
          transcodificationId: data.transcodificationId,
          transcodificationCode: data.transcodificationCode,
        };
    
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    defaultRequestDeleteRegisterTranscodification(transcodificationId: number, successCallback: (res) => void, errorCallback: (res) => void) {
        // Request the list.
        const asyncTaskPipe = this.requestRegisterTranscodificationDelete(transcodificationId);
    
        this.ngRedux.dispatch(SagaHelper.runAsync(
          [],
          [],
          asyncTaskPipe,
          {},
          res => successCallback(res),
          res => errorCallback(res),
        ));
    }
    
    requestRegisterTranscodificationDelete(transcodificationId: number): any {
        const messageBody: IznesDeleteRegisterTranscofificationRequestBody = {
          RequestName: 'izndeleteregistertranscodification',
          token: this.memberSocketService.token,
          transcodificationId,
        };
    
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    defaultRequestCreateRegisterTranscodification(data: IznesCreateRegisterTranscofification, successCallback: (res) => void, errorCallback: (res) => void) {
        // Request the list.
        const asyncTaskPipe = this.requestRegisterTranscodificationCreate(data);
    
        this.ngRedux.dispatch(SagaHelper.runAsync(
          [],
          [],
          asyncTaskPipe,
          {},
          res => successCallback(res),
          res => errorCallback(res),
        ));
    }
    
    requestRegisterTranscodificationCreate(data: IznesCreateRegisterTranscofification): any {
        const messageBody: IznesCreateRegisterTranscofificationRequestBody = {
          RequestName: 'izncreateregistertranscodification',
          token: this.memberSocketService.token,
          kycId: data.kycId,
          thirdPartyId: data.thirdPartyId,
          transcodificationCode: data.transcodificationCode,
        };
    
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
