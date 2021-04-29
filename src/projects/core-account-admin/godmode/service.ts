import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

/* Membersocket and nodeSagaRequest import. */
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeRequest } from '@setl/utils/common';

@Injectable({
  providedIn: 'root'
})
export class GodModeService {

  constructor(private memberSocketService: MemberSocketService,
    private ngRedux: NgRedux<any>,
  ) { }

  requestGiveMeAccessAdmin(data): any {
    const messageBody = {
      RequestName: 'izngivemeaccessadmin',
      token: this.memberSocketService.token,
      username: data.username,
    };

    return createMemberNodeRequest(this.memberSocketService, messageBody);
  }
}
