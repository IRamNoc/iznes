import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {
    RequestPermissionGroupListMessageBody
} from './permission-group.service.model';


@Injectable()
export class PermissionGroupService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    requestPermissionGroupList(): any {
        const messageBody: RequestPermissionGroupListMessageBody = {
            RequestName: 'gpgl',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
