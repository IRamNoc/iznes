import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {LoginRequestMessageBody, UserDetailsRequestMessageBody, SaveUserDetailsRequestBody} from './my-user.service.model';

interface LoginRequestData {
    username: string;
    password: string;
}

interface UserDetailsData {
    displayName: string;
    firstName: string;
    lastName: string;
    mobilePhone: string;
    addressPrefix: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    postalCode: string;
    country: string;
    memorableQuestion: string;
    memorableAnswer: string;
    profileText: string;
}

@Injectable()
export class MyUserService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    loginRequest(loginData: LoginRequestData): any {
        const messageBody: LoginRequestMessageBody = {
            RequestName: 'Login',
            UserName: loginData.username,
            Password: loginData.password,
            CFCountry: '.'
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestMyUserDetails(): any {
        const messageBody: UserDetailsRequestMessageBody = {
            RequestName: 'gud',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveMyUserDetails(userData: UserDetailsData): any {
        const messageBody: SaveUserDetailsRequestBody = {
            RequestName: 'ud',
            token: this.memberSocketService.token,
            displayName: userData.displayName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobilePhone: userData.mobilePhone,
            addressPrefix: userData.addressPrefix,
            address1: userData.address1,
            address2: userData.address2,
            address3: userData.address3,
            address4: userData.address4,
            postalCode: userData.postalCode,
            country: userData.country,
            memorableQuestion: userData.memorableQuestion,
            memorableAnswer: userData.memorableAnswer,
            profileText: userData.profileText
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
