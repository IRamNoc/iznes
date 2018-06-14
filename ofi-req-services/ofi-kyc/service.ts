import {Injectable} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';

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
    fetchInvitationsByUserAmCompanyRequestBody,
} from './model';

import {createMemberNodeRequest, createMemberNodeSagaRequest} from '@setl/utils/common';

import * as _ from 'lodash';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import {SagaHelper} from '@setl/utils';
import {SET_AMKYCLIST, SET_REQUESTED} from '@ofi/ofi-main/ofi-store/ofi-kyc/ofi-am-kyc-list';
import {SET_INFORMATIONS_FROM_API} from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';
import {
    SET_INVESTOR_INVITATIONS_LIST,
    SET_INVESTOR_INVITATIONS_LIST_REQUESTED
} from '@ofi/ofi-main/ofi-store/ofi-kyc/invitationsByUserAmCompany';

@Injectable()
export class OfiKycService {

    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiKyc', 'investorInvitations', 'requested']) investorInvitationsRequested$;

    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>
    ) {

    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
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
            investors: _.get(requstData, 'investors', [])
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

    isInvitationTokenUsed(token: string): any {

        const messageBody: VerifyInvitationTokenRequestBody = {
            RequestName: 'iznesistokenused',
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
            invitedID: _.get(requestData, 'invitedID', '')
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

    getInvitationsByUserAmCompany() {

        this.investorInvitationsRequested$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (d) {
                    return;
                }
                this.fetchInvitationsByUserAmCompany();
            });

    }

    fetchInvitationsByUserAmCompany() {
        const messageBody: fetchInvitationsByUserAmCompanyRequestBody = {
            RequestName: 'getinvitationsbyuseramcompany',
            token: this.memberSocketService.token
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_INVESTOR_INVITATIONS_LIST],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch({
                    type: SET_INVESTOR_INVITATIONS_LIST_REQUESTED
                });
            }
        ));
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
            lang: options.lang,
            amFirstName: options.amFirstName,
            amCompanyName: options.amCompanyName,
            investorCompanyName: options.investorCompanyName,
            investorEmail: options.investorEmail,
            investorPhoneNumber: options.investorPhoneNumber
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

    updateInvestor(request) {
        const messageBody = {
            RequestName: 'iznesupdateinvestor',
            token: this.memberSocketService.token,
            ...request,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    saveFundAccess(requestData: SaveFundAccessRequestData): any {

        const messageBody: SaveFundAccessRequestBody = {
            RequestName: 'iznesfundaccessadd',
            token: this.memberSocketService.token,
            access: _.get(requestData, 'access', ''),
            kycID: _.get(requestData, 'kycID', ''),
            investorWalletID: _.get(requestData, 'investorWalletID', ''),
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }
}


