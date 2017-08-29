import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {
    RequestAccountListMessageBody,
} from './account.service.model';


@Injectable()
export class AccountsService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    requestAccountList(): any {
        const messageBody: RequestAccountListMessageBody = {
            RequestName: 'gal',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
