/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';
import {
  IznesNewTransferRequestBody
} from './model'
import { SagaHelper } from '@setl/utils';

@Injectable({
  providedIn: 'root'
})
export class TransferInOutService {

  constructor(private memberSocketService: MemberSocketService,
    private ngRedux: NgRedux<any>,
) {
/* Stub. */
}

addNewTransfer(requestData: {
  shareIsin: string;
  portfolioId: number;
  subportfolio: string,
  dateBy: string;
  dateValue: string;
  orderType: string;
  orderBy: string;
  orderValue: number;
  comment: string;
}): any {
  const messageBody: IznesNewTransferRequestBody = {
      RequestName: 'iznesnewtransfer',
      token: this.memberSocketService.token,
      shareisin: requestData.shareIsin,
      portfolioid: requestData.portfolioId,
      subportfolio: requestData.subportfolio,
      dateby: requestData.dateBy,
      datevalue: requestData.dateValue,
      ordertype: requestData.orderType,
      orderby: requestData.orderBy,
      ordervalue: requestData.orderValue,
      comment: requestData.comment,
  };

  return createMemberNodeRequest(this.memberSocketService, messageBody);
}

}
