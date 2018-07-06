import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { createMemberNodeSagaRequest } from '@setl/utils/common';
import { MemberSocketService } from '@setl/websocket-service';

import { AccountAdminBaseService } from '../../../base/service';

@Injectable()
export class UserManagementService extends AccountAdminBaseService {
    constructor(redux: NgRedux<any>,
                private memberSocketService: MemberSocketService) {
        super(redux);
    }
}
