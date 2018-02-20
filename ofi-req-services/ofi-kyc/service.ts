import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {
    SendInvestInvitationRequestBody,
    SendInvitationRequestData
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

}
