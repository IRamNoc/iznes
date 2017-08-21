import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {RequestOwnWalletsMessageBody} from './my-wallets.service.model';


@Injectable()
export class MyWalletsService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    requestOwnWallets(): any {
        const messageBody: RequestOwnWalletsMessageBody = {
            RequestName: 'gmywa',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
