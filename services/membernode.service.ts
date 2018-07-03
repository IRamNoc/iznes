import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service/member-socket.service';
import { createMemberNodeRequest, MemberNodeMessageBody } from '@setl/utils/common';

@Injectable()
export class MemberNodeService {
    constructor(private memberSocketService: MemberSocketService) {}

    request(message: MemberNodeMessageBody): Promise<any> {
        return new Promise((resolve, reject) => {
            createMemberNodeRequest(this.memberSocketService, { ...message, token: this.memberSocketService.token }).then(resp => resolve(resp[1]));
        });
    }

    setToken(token: string): void {
        this.memberSocketService.token = token;
    }
}
