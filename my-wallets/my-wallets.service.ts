import { Injectable } from '@angular/core';
import { MemberSocketService } from '@setl/websocket-service';
import { SagaHelper, Common } from '@setl/utils';
import { createMemberNodeSagaRequest } from '@setl/utils/common';
import {
    RequestOwnWalletsMessageBody,
    SetActiveWalletMessageBody,
    RequestWalletDirectoryMessageBody,
    RequestManagedWalletsMessageBody,
    RequestWalletToRelationshipMessageBody,
    RequestWalletLabelMessageBody,
    NewWalletLabelMessageBody,
    UpdateWalletLabelMessageBody,
} from './my-wallets.service.model';
import * as _ from 'lodash';
import { NgRedux } from '@angular-redux/store';
import {
    setRequestedWalletLabel,
    SET_WALLET_LABEL,
} from '@setl/core-store';

@Injectable()
export class MyWalletsService {
    constructor(private memberSocketService: MemberSocketService) {
    }

    static defaultRequestWalletLabel(ngRedux: NgRedux<any>, myWalletService: MyWalletsService, walletId: number) {

        console.log('+++ REQUEST WALLET LABELS');

        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedWalletLabel());

        // Request the list.
        const asyncTaskPipe = myWalletService.requestWalletLabel({
            walletId,
        });

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_LABEL],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    requestOwnWallets(): any {
        const messageBody: RequestOwnWalletsMessageBody = {
            RequestName: 'gmywa',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    setActiveWallet(walletId: number): any {
        const messageBody: SetActiveWalletMessageBody = {
            RequestName: 'setactivewallet',
            token: this.memberSocketService.token,
            walletId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestWalletDirectory(): any {
        const messageBody: RequestWalletDirectoryMessageBody = {
            RequestName: 'gwd',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    requestManagedWallets(): any {
        const messageBody: RequestManagedWalletsMessageBody = {
            RequestName: 'gwl',
            token: this.memberSocketService.token,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Request wallet to relationship.
     * @return {any}
     */
    requestWalletToRelationship(requestData: object): any {
        const walletId = _.get(requestData, 'walletId', 0);

        const messageBody: RequestWalletToRelationshipMessageBody = {
            RequestName: 'glrtl',
            token: this.memberSocketService.token,
            senderLei: walletId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Request wallet label - subportfolio.
     * @return {any}
     */
    requestWalletLabel(requestData: object): any {
        const walletId = _.get(requestData, 'walletId', 0);

        const messageBody: RequestWalletLabelMessageBody = {
            RequestName: 'getwalletlabels',
            token: this.memberSocketService.token,
            walletId,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Add wallet label - subportfolio.
     * @return {any}
     */
    newWalletLabel(requestData: object): any {
        const walletId = _.get(requestData, 'walletId', 0);
        const option = _.get(requestData, 'option', '');
        const label = _.get(requestData, 'label', '');
        const iban = _.get(requestData, 'iban', '');

        const messageBody: NewWalletLabelMessageBody = {
            RequestName: 'newWalletLabels',
            token: this.memberSocketService.token,
            walletId,
            option,
            label,
            iban,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    /**
     * Update wallet label - subportfolio.
     * @return {any}
     */
    updateWalletLabel(requestData: object): any {
        const walletId = _.get(requestData, 'walletId', 0);
        const option = _.get(requestData, 'option', '');
        const label = _.get(requestData, 'label', '');
        const iban = _.get(requestData, 'iban', '');

        const messageBody: UpdateWalletLabelMessageBody = {
            RequestName: 'updateWalletLabels',
            token: this.memberSocketService.token,
            walletId,
            option,
            label,
            iban,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }
}
