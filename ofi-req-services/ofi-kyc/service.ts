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
    UseTokenRequestBody,
    fetchInvitationsByUserAmCompanyRequestBody,
    getKycRequestDetailsRequestBody,
    SaveKycDocumentRequestData,
    SaveKycDocumentRequestBody,
    GetKycDocumentRequestData,
    GetKycDocumentRequestBody,
    GetMyKycListRequestBody,
    createKYCDraftMessageBody,
    createKYCDraftRequestData,
    DeleteKycRequestData,
    DeleteKycRequestMessageBody,
    GetClientReferentialMessageBody,
    AuditSearchRequestBody,
    AuditSearchRequestData,
} from './model';

import { createMemberNodeRequest, createMemberNodeSagaRequest } from '@setl/utils/common';

import * as _ from 'lodash';
import { SagaHelper } from '@setl/utils';
import {
    SET_AMKYCLIST,
    SET_REQUESTED,
    setrequested,
    clearrequested,
} from '@ofi/ofi-main/ofi-store/ofi-kyc/ofi-am-kyc-list';
import {
    SET_KYC_DETAILS_GENERAL,
    SET_KYC_DETAILS_COMPANY,
    SET_KYC_DETAILS_COMPANYBENEFICIARIES,
    SET_KYC_DETAILS_BANKING,
    SET_KYC_DETAILS_CLASSIFICATION,
    SET_KYC_DETAILS_RISKNATURE,
    SET_KYC_DETAILS_RISKOBJECTIVES,
    SET_KYC_DETAILS_DOCUMENTS,
    SET_KYC_DETAILS_VALIDATION,

    setkycdetailsgeneralrequested,
    setkycdetailscompanyrequested,
    setkycdetailscompanybeneficiariesrequested,
    setkycdetailsbankingrequested,
    setkycdetailsclassificationrequested,
    setkycdetailsrisknaturerequested,
    setkycdetailsriskobjectivesrequested,
    setkycdetailsdocumentsrequested,
    setkycdetailsvalidationrequested,
} from '../../ofi-store/ofi-kyc/kyc-details';
import { SET_INFORMATIONS_FROM_API } from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';
import {
    ofiClearRequestedClientReferential,
    SET_MY_KYC_LIST,
    SET_MY_KYC_LIST_REQUESTED,
    ofiSetRequestedClientReferential,
    OFI_SET_CLIENT_REFERENTIAL,
} from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import {
    SET_INVESTOR_INVITATIONS_LIST,
    SET_INVESTOR_INVITATIONS_LIST_REQUESTED,
} from '@ofi/ofi-main/ofi-store/ofi-kyc/invitationsByUserAmCompany';
import {
    setStatusAuditTrail,
    SET_STATUS_AUDIT_TRAIL_REQUESTED,
} from '@ofi/ofi-main/ofi-store/ofi-kyc/status-audit-trail';
import {
    setInformationAuditTrail,
    SET_INFORMATION_AUDIT_TRAIL_REQUESTED,
} from '@ofi/ofi-main/ofi-store/ofi-kyc/information-audit-trail';
import {
    OFI_SET_MY_DOCUMENTS_LIST,
    OFI_SET_REQUESTED_MY_DOCUMENTS,
} from '@ofi/ofi-main/ofi-store/ofi-kyc/inv-my-documents';

import { investorInvitation } from '../../ofi-store/ofi-kyc/invitationsByUserAmCompany/model';

@Injectable()
export class OfiKycService {
    informationAuditTrailList = [];
    statusAuditTrailList = [];
    validConnectedWallet$: Subject<number>;
    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiKyc', 'informationAuditTrail', 'list']) informationAuditTrailList$;
    @select(['ofi', 'ofiKyc', 'statusAuditTrail', 'requested']) statusAuditTrailRequested$;
    @select(['ofi', 'ofiKyc', 'statusAuditTrail', 'list']) statusAuditTrailList$;
    @select(['user', 'authentication', 'isLogin']) isLogin$;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;

    constructor(
        private memberSocketService: MemberSocketService,
        private ngRedux: NgRedux<any>,
    ) {

        this.informationAuditTrailList$
        .takeUntil(this.unSubscribe)
        .subscribe((list) => {
            this.informationAuditTrailList = list;
        });

        this.statusAuditTrailList$
        .takeUntil(this.unSubscribe)
        .subscribe((list) => {
            this.statusAuditTrailList = list;
        });

        this.statusAuditTrailRequested$
        .takeUntil(this.unSubscribe)
        .subscribe((b) => {
            if (!b) {
                this.statusAuditTrailList.map((kycID) => {
                    this.fetchStatusAuditByKycID(kycID);
                });
            }
        });

        this.validConnectedWallet$ = this.connectedWallet$
        .pipe(
            filter((walletId: number) => (walletId !== 0 && !!walletId)),
        )
        .takeUntil(this.unSubscribe);
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
            {},
        ));
    }

    /* START My Request Details */

    static defaultRequestKycDetailsGeneral(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setkycdetailsgeneralrequested());

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycGeneral(kycID);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_DETAILS_GENERAL],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestKycDetailsCompany(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setkycdetailscompanyrequested());

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycCompany(kycID);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_DETAILS_COMPANY],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestKycDetailsCompanyBeneficiaries(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setkycdetailscompanybeneficiariesrequested());

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycCompanyBeneficiaries(kycID);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_DETAILS_COMPANYBENEFICIARIES],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestKycDetailsBanking(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setkycdetailsbankingrequested());

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycBanking(kycID);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_DETAILS_BANKING],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestKycDetailsClassification(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setkycdetailsclassificationrequested());

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycClassification(kycID);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_DETAILS_CLASSIFICATION],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestKycDetailsRiskNature(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setkycdetailsrisknaturerequested());

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycRiskNature(kycID);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_DETAILS_RISKNATURE],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestKycDetailsRiskObjectives(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setkycdetailsriskobjectivesrequested());

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycRiskObjective(kycID);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_DETAILS_RISKOBJECTIVES],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestKycDetailsDocuments(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setkycdetailsdocumentsrequested());

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycDocument(kycID);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_DETAILS_DOCUMENTS],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    static defaultRequestKycDetailsValidation(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, kycID) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setkycdetailsvalidationrequested());

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycValidation(kycID);

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_DETAILS_VALIDATION],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    /* END My Request Details */

    static defaultRequestGetInvKycDocuments(ofiKycService: OfiKycService, ngRedux: NgRedux<any>, getKycDocumentRequestData: GetKycDocumentRequestData) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch({ type: OFI_SET_REQUESTED_MY_DOCUMENTS });

        // Request the list.
        const asyncTaskPipe = ofiKycService.getKycDocuments(getKycDocumentRequestData);

        ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_MY_DOCUMENTS_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    requestKycDocumentByID(ngRedux: NgRedux<any>, kycDocumentID) {
        const messageBody = {
            token: this.memberSocketService.token,
            RequestName: 'getkycdocument',
            kycDocumentID,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    notifyKycCompletion(investorID, message, kycID) {
        const messageBody = {
            token: this.memberSocketService.token,
            RequestName: 'iznnotifyinvestorkyccompletion',
            investorID,
            message,
            kycID,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    sendInvestInvitations(requstData: SendInvitationRequestData): any {

        const messageBody: SendInvestInvitationRequestBody = {
            RequestName: 'iznesinvestorinvitation',
            token: this.memberSocketService.token,
            assetManagerName: _.get(requstData, 'assetManagerName', ''),
            amCompanyName: _.get(requstData, 'amCompanyName', ''),
            investors: _.get(requstData, 'investors', []),
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

    useInvitationToken(invitationToken: string) {
        const messageBody: UseTokenRequestBody = {
            RequestName: 'izneskycusetoken',
            invitationToken,
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

    getMyKycList() {
        // this method returned a promise before, now it does not return anything. The change to try to pass in the walletId
        // instead of always passing in '0'. But the caller of the method did not use the returned promised anyway.
        this.validConnectedWallet$.pipe(take(1)).subscribe(
            (walletId) => {
                const messageBody: GetMyKycListRequestBody = {
                    RequestName: 'iznesgetmykyclist',
                    token: this.memberSocketService.token,
                    walletid: walletId,
                };

                const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

                return this.buildRequest({
                    taskPipe: asyncTaskPipe,
                    successActions: [SET_MY_KYC_LIST, SET_MY_KYC_LIST_REQUESTED],
                });
            },
        );
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
            taskPipe: createMemberNodeSagaRequest(this.memberSocketService, messageBody),
            successActions: [SET_INFORMATIONS_FROM_API],
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
                    },
                ),
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
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    /* My Request Details */

    getKycBanking(kycID: number): any {
        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycbanking',
            token: this.memberSocketService.token,
            kycID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycClassification(kycID: number): any {
        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycclassification',
            token: this.memberSocketService.token,
            kycID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycCompany(kycID: number): any {
        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkyccompany',
            token: this.memberSocketService.token,
            kycID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycCompanyBeneficiaries(kycID: number): any {
        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkyccompanybeneficiaries',
            token: this.memberSocketService.token,
            kycID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycGeneral(kycID: number): any {
        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycgeneral',
            token: this.memberSocketService.token,
            kycID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycDocument(kycID: number): any {
        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycdocument',
            token: this.memberSocketService.token,
            kycID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycRiskNature(kycID: number): any {
        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycrisknature',
            token: this.memberSocketService.token,
            kycID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycRiskObjective(kycID: number): any {
        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycriskobjective',
            token: this.memberSocketService.token,
            kycID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycValidation(kycID: number): any {
        const messageBody: getKycRequestDetailsRequestBody = {
            RequestName: 'getkycvalidation',
            token: this.memberSocketService.token,
            kycID,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    saveKycDocument(requestData: SaveKycDocumentRequestData): any {
        const messageBody: SaveKycDocumentRequestBody = {
            RequestName: 'updatekycdocument',
            token: this.memberSocketService.token,
            walletID: _.get(requestData, 'walletID', 0),
            name: _.get(requestData, 'name', ''),
            hash: _.get(requestData, 'hash', ''),
            type: _.get(requestData, 'type', ''),
            common: _.get(requestData, 'common', ''),
            isDefault: _.get(requestData, 'default', 0),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    getKycDocuments(requestData: GetKycDocumentRequestData): any {
        const messageBody: GetKycDocumentRequestBody = {
            RequestName: 'getkycdocument',
            token: this.memberSocketService.token,
            walletID: _.get(requestData, 'walletID', 0),
            kycID: _.get(requestData, 'kycID', 0),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    deleteKycDocument(kycDocumentID: number) {
        const messageBody = {
            RequestName: 'deletekycdocument',
            token: this.memberSocketService.token,
            kycDocumentID,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    createKYCDraftOrWaitingApproval(requestData: createKYCDraftRequestData) {
        const messageBody: createKYCDraftMessageBody = {
            RequestName: 'izncreatedraftorwaitingapprovalkycrequest',
            token: this.memberSocketService.token,
            inviteToken: _.get(requestData, 'inviteToken', ''),
            managementCompanyID: _.get(requestData, 'managementCompanyID', ''),
            investorWalletID: _.get(requestData, 'investorWalletID', ''),
            kycStatus: _.get(requestData, 'kycStatus', ''),
            alreadyCompleted: _.get(requestData, 'alreadyCompleted', ''),
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    deleteKycRequest(requestData: DeleteKycRequestData) {
        const messageBody: DeleteKycRequestMessageBody = {
            RequestName: 'izndeletekycrequest',
            token: this.memberSocketService.token,
            kycID: _.get(requestData, 'kycID'),
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    getStatusAuditByKycID(kycID: number) {
        if (this.statusAuditTrailList.indexOf(kycID) !== -1) {
            return;
        }
        this.fetchStatusAuditByKycID(kycID);
    }

    fetchStatusAuditByKycID(kycID: number) {
        const messageBody = {
            RequestName: 'getkycstatusauditbykycid',
            token: this.memberSocketService.token,
            kycID,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            (res) => {
                this.ngRedux.dispatch(setStatusAuditTrail(kycID, res));
                this.ngRedux.dispatch({
                    type: SET_STATUS_AUDIT_TRAIL_REQUESTED,
                });
            },
        ));
    }

    getInformationAuditByKycID(kycID: number) {
        if (this.informationAuditTrailList.indexOf(kycID) !== -1) {
            return;
        }
        this.fetchInformationAuditByKycID(kycID);
    }

    fetchInformationAuditByKycID(kycID: number) {
        const messageBody = {
            RequestName: 'getkycinformationauditbykycid',
            token: this.memberSocketService.token,
            kycID,
        };

        const asyncTaskPipe = createMemberNodeSagaRequest(this.memberSocketService, messageBody);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            (res) => {
                this.ngRedux.dispatch(setInformationAuditTrail(kycID, res));
                this.ngRedux.dispatch({
                    type: SET_INFORMATION_AUDIT_TRAIL_REQUESTED,
                });
            },
        ));
    }

    notifyAMKycContinuedFromRequest(kycID) {
        const messageBody = {
            RequestName: 'iznnotifyamfromrequest',
            token: this.memberSocketService.token,
            type: 'kycContinuedFromRequest',
            kycID,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    notifyAMKycContinuedFromAskMoreInfo(kycID) {
        const messageBody = {
            RequestName: 'iznnotifyamfromaskmoreinfo',
            token: this.memberSocketService.token,
            type: 'kycContinuedFromAskMoreInfo',
            kycID,
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    getclientreferential(type: number): any {
        const messageBody: GetClientReferentialMessageBody = {
            RequestName: 'izngetclientreferential',
            token: this.memberSocketService.token,
            type,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    defaultrequestgetclientreferential(type) {
        // Set the state flag to true. so we do not request it again.
        this.setRequestedClientReferential(true);

        // Request the list.
        const asyncTaskPipe = this.getclientreferential(type);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_CLIENT_REFERENTIAL],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    setRequestedClientReferential(boolValue: boolean) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            this.ngRedux.dispatch(ofiClearRequestedClientReferential());
        } else {
            this.ngRedux.dispatch(ofiSetRequestedClientReferential());
        }
    }

    setRequestedAMKycList(boolValue: boolean) {
        // false = doRequest | true = already requested
        if (!boolValue) {
            this.ngRedux.dispatch(clearrequested());
        } else {
            this.ngRedux.dispatch(setrequested());
        }
    }

    requestAuditSearch(requestData: AuditSearchRequestData): any {
        const messageBody: AuditSearchRequestBody = {
            RequestName: 'iznesreferentialauditsearch',
            token: this.memberSocketService.token,
            id: _.get(requestData, 'id', ''),
            search: _.get(requestData, 'search', ''),
            from: _.get(requestData, 'from', ''),
            to: _.get(requestData, 'to', ''),
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
