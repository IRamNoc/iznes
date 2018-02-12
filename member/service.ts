import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {
    RequestManageMemberListMessageBody,
    AddMemberMessageBody,
    EditMemberMessageBody,
    DeleteMemberMessageBody
} from './service.model';
import * as _ from 'lodash';

interface AddMemberRequest {
    memberName: string;
    email: string;
}

interface EditMemberRequest {
    memberId: number;
    memberName: string;
}

interface DeleteMemberRequest {
    memberId: number;
}

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

    addMember(requestData: AddMemberRequest): any {
        const messageBody: AddMemberMessageBody = {
            RequestName: 'nm',
            token: this.memberSocketService.token,
            memberName: _.get(requestData, 'memberName', ''),
            email: _.get(requestData, 'email', '')
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    editMember(requestData: EditMemberRequest): any {
        const messageBody: EditMemberMessageBody = {
            RequestName: 'udm',
            token: this.memberSocketService.token,
            memberId: _.get(requestData, 'memberId', 0),
            memberName: _.get(requestData, 'memberName', ''),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    deleteMember(requestData: DeleteMemberRequest): any {
        const messageBody: DeleteMemberMessageBody = {
            RequestName: 'dm',
            token: this.memberSocketService.token,
            memberId: _.get(requestData, 'memberId', 0),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}

