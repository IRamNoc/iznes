import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {
    CreateUserRequestBody,
    CreateUserRequestData,
    SendInvestInvitationRequestBody,
    SendInvitationRequestData,
    VerifyInvitationTokenRequestBody,
    WaitingApprovalMessageBody
} from './model';
import {createMemberNodeRequest} from '@setl/utils/common';
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
            RequestName: 'iznesverifytoken',
            token: token,
            source: ''
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
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

    /**
     * Accept an investor's KYC approval
     *
     * @param {number} kycId
     * @returns {any}
     */
    approve(kycId: number): any {
        const messageBody: WaitingApprovalMessageBody = {
            RequestName: 'iznesapprovekyc',
            token: this.memberSocketService.token,
            kycID: kycId
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    /**
     * Reject an investor's KYC approval
     *
     * @param {number} kycId
     * @returns {any}
     */
    reject(kycId: number) {
        const messageBody: WaitingApprovalMessageBody = {
            RequestName: 'iznesrejectkyc',
            token: this.memberSocketService.token,
            kycID: kycId
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    /**
     * Ask more informations for an investor's KYC approval
     * @param {number} kycId
     * @returns {any}
     */
    askMoreInfo(kycId: number) {
        const messageBody: WaitingApprovalMessageBody = {
            RequestName: 'iznesrequestmoreinfo',
            token: this.memberSocketService.token,
            kycID: kycId
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }
}

