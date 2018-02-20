import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeRequest} from '@setl/utils/common';
import * as _ from 'lodash';

interface RequestBody {
   RequestName: string;
   token: string;
}

@Injectable()
export class CommonRequestService {
    constructor(private memberSocketService: MemberSocketService) {
    }

    memberNodeRequest(messageBody: RequestBody): any {

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

}
