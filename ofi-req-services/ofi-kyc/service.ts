import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {
    SendInvestInvitationRequestBody,
    SendInvitationRequestData,
    VerifyInvitationTokenRequestBody,
    CreateUserRequestBody,
    CreateUserRequestData,
    GetAmKycListRequestBody
} from './model';
import {createMemberNodeRequest, createMemberNodeSagaRequest} from '@setl/utils/common';
import {NgRedux} from '@angular-redux/store';
import * as _ from 'lodash';
import {SET_AMKYCLIST, SET_REQUESTED, CLEAR_REQUESTED} from '../../ofi-store/ofi-kyc/ofi-am-kyc-list';
import {SagaHelper, Common} from '@setl/utils';

@Injectable()
export class OfiKycService {
    constructor(private memberSocketService: MemberSocketService) {
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
            accountDescription: _.get(requestData, 'email', '') + '_account'
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    getAmKycList(): any {

        const messageBody: GetAmKycListRequestBody = {
            RequestName: '',
            token: this.memberSocketService.token
        };

        // return new Promise().resolve();     //maybe?
        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}

