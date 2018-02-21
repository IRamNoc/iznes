import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {
    SendInvestInvitationRequestBody,
    SendInvitationRequestData,
    VerifyInvitationTokenRequestBody,
    CreateUserRequestBody,
    CreateUserRequestData
} from './model';
import {createMemberNodeRequest} from '@setl/utils/common';
import {NgRedux} from '@angular-redux/store';
import * as _ from 'lodash';

@Injectable()
export class OfiKycService {
    constructor(private memberSocketService: MemberSocketService) {
    }

    sendInvestInvitations(requstData: SendInvitationRequestData): any {

        const messageBody: SendInvestInvitationRequestBody = {
            RequestName: 'iznesinvestorinvitation',
            token: this.memberSocketService.token,
            assetManagerName: _.get(requstData, 'assetManagerName', ''),
            amCompanyName: _.get(requstData, 'amCompanyName', ''),
            investors: _.get(requstData, 'investors', []),
            lang: _.get(requstData, 'lang', 'fr')
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    verifyInvitationToken(token: string): any {

        const messageBody: VerifyInvitationTokenRequestBody = {
            RequestName: '',
            token: token
        };

        return Promise.resolve({Status: 'OK', email: 'stephen.strudwick@setl.io'}); //test code
        //return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    createUser(requestData: CreateUserRequestData): any {

        const messageBody: CreateUserRequestBody = {
            RequestName: 'iznessignup',
            token: _.get(requestData, 'token', ''),
            email: _.get(requestData, 'email', ''),
            password: _.get(requestData, 'password', ''),
            accountName: _.get(requestData, 'email', ''),
            accountDescription: _.get(requestData, 'email', '') + '_account'
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }
}

