import {MemberSocketService} from '@setl/websocket-service';
import {Injectable} from '@angular/core';

@Injectable()
export class MemberSocketServiceMock extends MemberSocketService {
    token = 'fake token';
}
