import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {WalletNodeRequestService} from '../index';
import {MyWalletsService} from '../index';
import {ChannelService} from '../index';

import {SET_WALLET_ADDRESSES, SET_OWN_WALLETS, SET_WALLET_HOLDING} from '@setl/core-store';

import {AccountsService} from '../index';
import {PermissionGroupService} from '../index';
import {
    SET_WALLET_ADDRESSES,
    SET_OWN_WALLETS,
    SET_WALLET_DIRECTORY,
    SET_ACCOUNT_LIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST,
    SET_TRANSACTIONAL_PERMISSION_GROUP_LIST,
    SET_MANAGED_WALLETS
} from '@setl/core-store';

import {SagaHelper} from '@setl/utils';
import {MemberSocketService} from '@setl/websocket-service';

@Injectable()
export class InitialisationService {

    constructor() {
    }

    static subscribe(memberSocketService, channelService) {
        memberSocketService.subscribeToChannel(function (data) {
            channelService.resolveChannelMessage(data);
        });
    }

    static walletnodeInitialisation(ngRedux: NgRedux<any>,
                                    walletNodeRequestService: WalletNodeRequestService,
                                    walletId: number): boolean {
        // Request wallet address.
        // walletAddressRequest
        this.requestWalletAddresses(ngRedux, walletNodeRequestService, walletId);

        // Request Wallet Balances
        this.requestWalletHolding(ngRedux, walletNodeRequestService, walletId);

        return true;

    }

    static requestWalletAddresses(ngRedux: NgRedux<any>,
                                  walletNodeRequestService: WalletNodeRequestService,
                                  walletId: number): boolean {
        // Create a saga pipe.
        const asyncTaskPipes = walletNodeRequestService.walletAddressRequest({
            walletId
        });

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        // Saga pipe function arguments.
        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_ADDRESSES],
            [],
            asyncTaskPipes, {}));

        return true;
    }

    static requestWalletHolding(ngRedux: NgRedux<any>,
                                walletNodeRequestService: WalletNodeRequestService,
                                walletId: number) {
        // Create a saga pipe.
        const asyncTaskPipes = walletNodeRequestService.requestWalletHolding({
            walletId
        });

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        // Saga pipe function arguments.
        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_HOLDING],
            [],
            asyncTaskPipes, {}));

        return false;
    }


    static membernodeInitialisation(ngRedux: NgRedux<any>,
                                    myWalletsService: MyWalletsService,
                                    memberSocketService: MemberSocketService,
                                    channelService: ChannelService,
                                    accountsService: AccountsService,
                                    permissionGroupService: PermissionGroupService): boolean {
        // Request my own wallets
        this.requestMyOwnWallets(ngRedux, myWalletsService);

        // Request wallet directory
        this.requestWalletDirectory(ngRedux, myWalletsService);

        // Request account list
        this.requestAccountList(ngRedux, accountsService);

        // Request permission group list (include administrative and transactional
        this.requestPermissionGroupList(ngRedux, permissionGroupService);

        // Request managed wallet list
        this.requestManagedWalletList(ngRedux, myWalletsService);

        // Subscribe to my connection channel, target for my userId.
        this.subscribe(memberSocketService, channelService);

        return true;
    }

    static requestMyOwnWallets(ngRedux: NgRedux<any>,
                               myWalletsService: MyWalletsService): boolean {
        // Create a saga pipe.
        const asyncTaskPipes = myWalletsService.requestOwnWallets();

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        // Saga pipe function arguments.
        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_OWN_WALLETS],
            [],
            asyncTaskPipes, {}));

        return true;
    }

    static requestWalletDirectory(ngRedux: NgRedux<any>,
                                  myWalletsService: MyWalletsService): boolean {
        const asyncTaskPipes = myWalletsService.requestWalletDirectory();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_DIRECTORY],
            [],
            asyncTaskPipes,
            {}
        ));

        return true;
    }

    static requestAccountList(ngRedux: NgRedux<any>,
                              accountsService: AccountsService): boolean {
        const asyncTaskPipes = accountsService.requestAccountList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_ACCOUNT_LIST],
            [],
            asyncTaskPipes,
            {},
            function (data) {
                console.log('account list', data);
            }
        ));

        return true;
    }

    static requestPermissionGroupList(ngRedux: NgRedux<any>,
                                      permissionGroupService: PermissionGroupService): boolean {
        const asyncTaskPipes = permissionGroupService.requestPermissionGroupList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST, SET_TRANSACTIONAL_PERMISSION_GROUP_LIST],
            [],
            asyncTaskPipes,
            {},
            function (data) {
                console.log('permission group list', data);
            }
        ));

        return true;
    }

    static requestManagedWalletList(ngRedux: NgRedux<any>,
                                    myWalletsService: MyWalletsService): boolean {
        const asyncTaskPipes = myWalletsService.requestManagedWallets();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_MANAGED_WALLETS],
            [],
            asyncTaskPipes,
            {},
            function (data) {
                console.log('wallet group list', data);
            },
            function (data) {
                console.log('fail wallet group', data);
            }
        ));

        return true;
    }
}
