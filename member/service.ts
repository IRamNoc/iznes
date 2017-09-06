import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {
    RequestManageMemberListMessageBody,
} from './service.model';


@Injectable()
export class MemberService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    requestMemberList(): any {
        const messageBody: RequestManageMemberListMessageBody = {
            RequestName: 'gml',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
