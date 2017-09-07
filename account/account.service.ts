import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {
    RequestAccountListMessageBody,
    AddAccountMessageBody,
    EditAccountMessageBody,
    DeleteAccountMessageBody
} from './account.service.model';

interface AddAccountRequest {
    accountName: string;
    accountDescription: string;
    memberId: number;
}

interface EditAccountRequest {
    accountId: number,
    accountName: string;
    accountDescription: string;
    walletId: number;
}

interface DeleteAccountRequest {
    accountId: number;
}

@Injectable()
export class AccountsService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    requestAccountList(): any {
        const messageBody: RequestAccountListMessageBody = {
            RequestName: 'gal',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    addAccount(requestData: AddAccountRequest): any {
        const messageBody: AddAccountMessageBody = {
            RequestName: 'na',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    editAccount(requestData: EditAccountRequest): any {
        const messageBody: EditAccountMessageBody = {
            RequestName: 'upa',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    deleteAccount(requestData: DeleteAccountRequest): any {
        const messageBody: DeleteAccountMessageBody = {
            RequestName: 'da',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
