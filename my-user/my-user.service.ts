import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from "../../utils/common";
import {LoginRequestMessageBody} from './my-user.service.model';

interface LoginRequestData {
    username: string;
    password: string;
}

@Injectable()
export class MyUserService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    loginRequest(loginData: LoginRequestData): any {
        const messageBody = {
            RequestName: 'Login',
            UserName: loginData.username,
            Password: loginData.password,
            CFCountry: '.'
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
