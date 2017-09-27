import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';

@Injectable()
export class OfiFundInvestService {
    constructor(private memberSocketService: MemberSocketService) {
        console.log(this.memberSocketService);
    }

}
