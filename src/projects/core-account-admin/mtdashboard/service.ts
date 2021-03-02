import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeRequest } from '@setl/utils/common';
import {
  listMtDashboardData,
  IznesGetMtDashboardRequestBody,
} from './model';

import { SagaHelper } from '@setl/utils';

@Injectable({
  providedIn: 'root'
})
export class MtdashboardService {

  constructor(private memberSocketService: MemberSocketService,
    private ngRedux: NgRedux<any>,
  ) { }


  defaultRequestMTDashboardList(data: listMtDashboardData, successCallback: (res) => void, errorCallback: (res) => void) {
    // Request the list.
    const asyncTaskPipe = this.requestMTDashboardList(data);

    this.ngRedux.dispatch(SagaHelper.runAsync(
      [],
      [],
      asyncTaskPipe,
      {},
      res => successCallback(res),
      res => errorCallback(res),
    ));
  }

  requestMTDashboardList(data: listMtDashboardData): any {
    const messageBody: IznesGetMtDashboardRequestBody = {
      RequestName: 'izngetmtdashboardlist',
      token: this.memberSocketService.token,
      pageSize: data.itemPerPage,
      rowOffset: data.rowOffset,
      mtType: data.mtType,
      fromDate: data.fromDate,
      toDate: data.toDate,
      isinCode: data.isinCode,
      fundShareName: data.fundShareName,
      centralizingAgentId: data.centralizingAgentId,
    };

    return createMemberNodeRequest(this.memberSocketService, messageBody);
  }
}
