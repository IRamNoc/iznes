// Vendors
import {Injectable} from '@angular/core';

// Internal
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {RequestMyChainAccessMessageBody} from './service.model';

@Injectable()
export class ChainService {
    constructor(private memberSocketService: MemberSocketService) {
    }


    requestMyChainAccess(): any {
        const messageBody: RequestMyChainAccessMessageBody = {
            RequestName: 'gmyca',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}

