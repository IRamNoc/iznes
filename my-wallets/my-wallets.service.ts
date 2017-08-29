import {Injectable} from '@angular/core';
import {MemberSocketService} from '@setl/websocket-service';
import {SagaHelper, Common} from '@setl/utils';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {
    RequestOwnWalletsMessageBody,
    SetActiveWalletMessageBody,
    RequestWalletDirectoryMessageBody,
    RequestManagedWalletsMessageBody
} from './my-wallets.service.model';


@Injectable()
export class MyWalletsService {

    constructor(private memberSocketService: MemberSocketService) {
    }

    requestOwnWallets(): any {
        const messageBody: RequestOwnWalletsMessageBody = {
            RequestName: 'gmywa',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    setActiveWallet(walletId: number): any {

        const messageBody: SetActiveWalletMessageBody = {
            RequestName: 'setactivewallet',
            token: this.memberSocketService.token,
            walletId: walletId
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestWalletDirectory(): any {
        const messageBody: RequestWalletDirectoryMessageBody = {
            RequestName: 'gwd',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestManagedWallets(): any {
        const messageBody: RequestManagedWalletsMessageBody = {
            RequestName: 'gwl',
            token: this.memberSocketService.token
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

}
