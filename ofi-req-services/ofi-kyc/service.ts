import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';

import { MemberSocketService } from '@setl/websocket-service';
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
    getKycRequestDetailsRequestData,
    getKycRequestDetailsRequestBody,
} from './model';

import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';

import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { SagaHelper } from '@setl/utils';
import { SET_AMKYCLIST, SET_REQUESTED } from '@ofi/ofi-main/ofi-store/ofi-kyc/ofi-am-kyc-list';
import {
    SET_KYC_MYREQ_DETAILS_GENERAL,
    setkycmyreqdetailsgeneralrequested,
    clearkycmyreqdetailsgeneralrequested,
    SET_KYC_MYREQ_DETAILS_COMPANY,
    setkycmyreqdetailscompanyrequested,
    clearkycmyreqdetailscompanyrequested,
    SET_KYC_MYREQ_DETAILS_COMPANYBENEFICIARIES,
    setkycmyreqdetailscompanybeneficiariesrequested,
    clearkycmyreqdetailscompanybeneficiariesrequested,
    SET_KYC_MYREQ_DETAILS_BANKING,
    setkycmyreqdetailsbankingrequested,
    clearkycmyreqdetailsbankingrequested,
    SET_KYC_MYREQ_DETAILS_CLASSIFICATION,
    setkycmyreqdetailsclassificationrequested,
    clearkycmyreqdetailsclassificationrequested,
    SET_KYC_MYREQ_DETAILS_RISKNATURE,
    setkycmyreqdetailsrisknaturerequested,
    clearkycmyreqdetailsrisknaturerequested,
    SET_KYC_MYREQ_DETAILS_RISKOBJECTIVES,
    setkycmyreqdetailsriskobjectivesrequested,
    clearkycmyreqdetailsriskobjectivesrequested,
    SET_KYC_MYREQ_DETAILS_DOCUMENTS,
    setkycmyreqdetailsdocumentsrequested,
    clearkycmyreqdetailsdocumentsrequested,
} from '../../ofi-store/ofi-kyc/ofi-my-request-details';
import { SET_INFORMATIONS_FROM_API } from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';
import {
    SET_INVESTOR_INVITATIONS_LIST,
    SET_INVESTOR_INVITATIONS_LIST_REQUESTED,
} from '@ofi/ofi-main/ofi-store/ofi-kyc/invitationsByUserAmCompany';

@Injectable()
export class OfiKycService {

    isListeningGetInvitationsByUserAmCompany;
    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiKyc', 'investorInvitations', 'requested']) investorInvitationsRequested$;
    @select(['user', 'authentication', 'isLogin']) isLogin$;

    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {
        this.isLogin$.subscribe((isLogin) => {
            if (isLogin) {
                return;
            }
            this.unSubscribe.next();
            this.unSubscribe.complete();
        });
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
            type: SET_REQUESTED,
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

    /* START My Request Details */

    static defaultRequestKycMyRequestDetailsGeneral(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch({
            type: setkycmyreqdetailscompanyrequested,
        });

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycGeneral(kycID);
        console.log('general', asyncTaskPipe);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_MYREQ_DETAILS_GENERAL],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    static defaultRequestKycMyRequestDetailsCompany(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch({
            type: setkycmyreqdetailsgeneralrequested,
        });

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycCompany(kycID);
        console.log('company', asyncTaskPipe);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_MYREQ_DETAILS_COMPANY],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    static defaultRequestKycMyRequestDetailsCompanyBeneficiaries(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch({
            type: setkycmyreqdetailscompanybeneficiariesrequested,
        });

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycCompanyBeneficiaries(kycID);
        console.log('companyBeneficiaries', asyncTaskPipe);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_MYREQ_DETAILS_COMPANYBENEFICIARIES],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    static defaultRequestKycMyRequestDetailsBanking(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch({
            type: setkycmyreqdetailsbankingrequested,
        });

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycBanking(kycID);
        console.log('banking', asyncTaskPipe);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_MYREQ_DETAILS_BANKING],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    static defaultRequestKycMyRequestDetailsClassification(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch({
            type: setkycmyreqdetailsclassificationrequested,
        });

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycClassification(kycID);
        console.log('classification', asyncTaskPipe);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_MYREQ_DETAILS_CLASSIFICATION],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    static defaultRequestKycMyRequestDetailsRiskNature(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch({
            type: setkycmyreqdetailsrisknaturerequested,
        });

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycRiskNature(kycID);
        console.log('risknature', asyncTaskPipe);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_MYREQ_DETAILS_RISKNATURE],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    static defaultRequestKycMyRequestDetailsRiskObjectives(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch({
            type: setkycmyreqdetailsriskobjectivesrequested,
        });

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycRiskObjective(kycID);
        console.log('riskobjective', asyncTaskPipe);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_MYREQ_DETAILS_RISKOBJECTIVES],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    static defaultRequestKycMyRequestDetailsDocuments(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch({
            type: setkycmyreqdetailsdocumentsrequested,
        });

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycDocument(kycID);
        console.log('documents', asyncTaskPipe);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_MYREQ_DETAILS_DOCUMENTS],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    /* END My Request Details */

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
            token,
            source: '',
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    isInvitationTokenUsed(token: string): any {

        const messageBody: VerifyInvitationTokenRequestBody = {
            RequestName: 'iznesistokenused',
            token,
            source: '',
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
            lang: _.get(requestData, 'lang', ''),
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
            invitedID: _.get(requestData, 'invitedID', ''),
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
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getInvitationsByUserAmCompany() {

        if (this.isListeningGetInvitationsByUserAmCompany) {
            return;
        }
        this.isListeningGetInvitationsByUserAmCompany = this.investorInvitationsRequested$
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
            token: this.memberSocketService.token,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_INVESTOR_INVITATIONS_LIST],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.ngRedux.dispatch({
                    type: SET_INVESTOR_INVITATIONS_LIST_REQUESTED,
                });
            },
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
            investorPhoneNumber: options.investorPhoneNumber,
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

    /* My Request Details */

    getKycBanking(requestData: getKycRequestDetailsRequestData): any {

        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycbanking',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID', ''),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycClassification(requestData: getKycRequestDetailsRequestData): any {

        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycclassification',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID', ''),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycCompany(requestData: getKycRequestDetailsRequestData): any {

        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkyccompany',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID', ''),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycCompanyBeneficiaries(requestData: getKycRequestDetailsRequestData): any {

        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkyccompanybeneficiaries',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID', ''),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycGeneral(requestData: getKycRequestDetailsRequestData): any {

        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycgeneral',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID', ''),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycDocument(requestData: getKycRequestDetailsRequestData): any {

        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycdocument',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID', ''),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycRiskNature(requestData: getKycRequestDetailsRequestData): any {

        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycrisknature',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID', ''),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycRiskObjective(requestData: getKycRequestDetailsRequestData): any {

        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycriskobjective',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID', ''),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
