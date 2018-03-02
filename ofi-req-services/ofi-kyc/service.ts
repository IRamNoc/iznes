import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';

import {MemberSocketService} from '@setl/websocket-service';
import {
    ApprovedKycMessageBody,
    ApprovedKycRequestData,
    AskForMoreInfoMessageBody,
    AskForMoreInfoRequestData,
    CreateUserRequestBody,
    CreateUserRequestData,
    GetAmKycListRequestBody,
    GetInvestorRequestBody,
    RejectedKycMessageBody,
    RejectedKycRequestData,
    SaveFundAccessRequestBody,
    SaveFundAccessRequestData,
    SendInvestInvitationRequestBody,
    SendInvitationRequestData,
    VerifyInvitationTokenRequestBody,
} from './model';

import {createMemberNodeRequest, createMemberNodeSagaRequest} from '@setl/utils/common';

import * as _ from 'lodash';
import {SagaHelper} from '@setl/utils';
import {SET_AMKYCLIST, SET_REQUESTED} from '@ofi/ofi-main/ofi-store/ofi-kyc/ofi-am-kyc-list';
import {SET_INFORMATIONS_FROM_API} from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';

@Injectable()
export class OfiKycService {
    constructor(private memberSocketService: MemberSocketService,
                private ngRedux: NgRedux<any>) {

    }

    /**
     * Default static call to get my fund access, and dispatch default actions, and other
     * default task.
     *
     * @param ofiFundInvestService
     * @param ngRedux
     */
    static defaultRequestAmKycList(ofiKycService: OfiKycService, ngRedux: NgRedux<any>) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch({
            type: SET_REQUESTED
        });

        // Request the list.
        const asyncTaskPipe = ofiKycService.getAmKycList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_AMKYCLIST],
            [],
            asyncTaskPipe,
            {}
        ));
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
            accountDescription: _.get(requestData, 'email', '') + '_account',
            lang: _.get(requestData, 'lang', '')
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    /**
     * Accept an investor's KYC approval
     *
     * @returns {any}
     * @param {ApprovedKycRequestData} requestData
     */
    approve(requestData: ApprovedKycRequestData): any {
        const messageBody: ApprovedKycMessageBody = {
            RequestName: 'iznesapprovekyc',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID', 0),
            investorEmail: _.get(requestData, 'investorEmail', ''),
            investorFirstName: _.get(requestData, 'investorFirstName', ''),
            investorCompanyName: _.get(requestData, 'investorCompanyName', ''),
            amCompanyName: _.get(requestData, 'amCompanyName', ''),
            lang: _.get(requestData, 'lang', ''),
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    /**
     * Reject an investor's KYC approval
     *
     * @returns {any}
     * @param {RejectedKycRequestData} requestData
     */
    reject(requestData: RejectedKycRequestData) {
        const messageBody: RejectedKycMessageBody = {
            RequestName: 'iznesrejectkyc',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID', 0),
            investorEmail: _.get(requestData, 'investorEmail', ''),
            investorFirstName: _.get(requestData, 'investorFirstName', ''),
            investorCompanyName: _.get(requestData, 'investorCompanyName', ''),
            amCompanyName: _.get(requestData, 'amCompanyName', ''),
            amEmail: _.get(requestData, 'amEmail', ''),
            amPhoneNumber: _.get(requestData, 'amPhoneNumber', ''),
            amInfoText: _.get(requestData, 'amInfoText', ''),
            lang: _.get(requestData, 'lang', ''),
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    /**
     * Ask more informations for an investor's KYC approval
     * @returns {any}
     * @param {AskForMoreInfoRequestData} requestData
     */
    askMoreInfo(requestData: AskForMoreInfoRequestData) {
        const messageBody: AskForMoreInfoMessageBody = {
            RequestName: 'iznesrequestmoreinfo',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID', 0),
            investorEmail: _.get(requestData, 'investorEmail', ''),
            investorFirstName: _.get(requestData, 'investorFirstName', ''),
            investorCompanyName: _.get(requestData, 'investorCompanyName', ''),
            amCompanyName: _.get(requestData, 'amCompanyName', ''),
            amEmail: _.get(requestData, 'amEmail', ''),
            amPhoneNumber: _.get(requestData, 'amPhoneNumber', ''),
            amInfoText: _.get(requestData, 'amInfoText', ''),
            lang: _.get(requestData, 'lang', ''),
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    getAmKycList(): any {

        const messageBody: GetAmKycListRequestBody = {
            RequestName: 'iznesgetamkyclist',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    fetchInvestor() {
        const messageBody: GetInvestorRequestBody = {
            RequestName: 'iznesgetinvestinvitation',
            token: this.memberSocketService.token,
        };

        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            'successActions': [SET_INFORMATIONS_FROM_API],
        });
    }

    sendNewKyc(options) {
        const messageBody = {
            RequestName: 'iznessendnewkyc',
            token: this.memberSocketService.token,
            inviteToken: options.invitationToken,
            amManagementCompanyID: options.amManagementCompanyID,
            investorWalletID: 0,
            selectedChoice: options.selectedChoice,
            lang: options.lang
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    buildRequest(options) {
        return new Promise((resolve, reject) => {
            /* Dispatch the request. */
            this.ngRedux.dispatch(
                SagaHelper.runAsync(
                    options.successActions || [],
                    options.failActions || [],
                    options.taskPipe,
                    {},
                    (response) => {
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    }
                )
            );
        });
    }

    saveFundAccess(requestData: SaveFundAccessRequestData): any {

        const messageBody: SaveFundAccessRequestBody = {
            RequestName: 'iznesfundaccessadd',
            token: this.memberSocketService.token,
            shareArray: _.get(requestData, 'shareArray', ''),
            kycID: _.get(requestData, 'kycID', ''),
            investorWalletID: _.get(requestData, 'investorWalletID', ''),
            entryFee: 0,
            exitFee: 0
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    removeFundAccess(requestData: SaveFundAccessRequestData): any {

        const messageBody: SaveFundAccessRequestBody = {
            RequestName: 'iznesfundaccessdelete',
            token: this.memberSocketService.token,
            shareArray: _.get(requestData, 'shareArray', ''),
            kycID: _.get(requestData, 'kycID', ''),
            investorWalletID: _.get(requestData, 'investorWalletID', ''),
            entryFee: 0,
            exitFee: 0
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }
}


