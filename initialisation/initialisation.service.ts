import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {
    AccountsService, ChainService, ChannelService, MyUserService, MyWalletsService, PermissionGroupService,
    WalletNodeRequestService
} from '../index';
import {
    clearRequestedAllInstruments, clearRequestedWalletAddresses, clearRequestedWalletHolding,
    clearRequestedWalletInstrument, clearRequestedWalletIssuer, clearRequestedWalletLabel, SET_ACCOUNT_LIST,
    SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST, SET_ALL_INSTRUMENTS_LIST, SET_MANAGED_WALLETS, SET_MY_CHAIN_ACCESS,
    SET_MY_INSTRUMENTS_LIST, SET_OWN_WALLETS, SET_TRANSACTIONAL_PERMISSION_GROUP_LIST, SET_USER_DETAILS,
    SET_WALLET_ADDRESSES, SET_WALLET_DIRECTORY, SET_WALLET_HOLDING, SET_WALLET_TO_RELATIONSHIP,
    setRequesteAllInstruments, setRequestedAccountList, setRequestedMyChainAccess, updateLastCreatedContractDetail,
    updateLastCreatedRegisterIssuerDetail
} from '@setl/core-store';
import * as _ from 'lodash';

import {SagaHelper} from '@setl/utils';
import {MemberSocketService} from '@setl/websocket-service';

@Injectable()
export class InitialisationService {

    channelUpdateCallbacks: Array<(data: string) => void>;

    constructor() {
        this.channelUpdateCallbacks = [];
    }

    /**
     * Subscribe to member socket service and handle all the callbacks.
     *
     * @param memberSocketService
     * @param channelService
     * @param initialisationService
     */
    static subscribe(memberSocketService: MemberSocketService,
                     channelService: ChannelService,
                     initialisationService: InitialisationService) {
        memberSocketService.subscribeToChannel((data) => {
            channelService.resolveChannelMessage(data);

            this.handleChannelUpdateCallbacks(data, initialisationService);
        });
    }

    /**
     * Handle all channel update callbacks.
     * The channel update callbacks can be dynamically create after initialisation service is instantiated.
     *
     * @param data
     * @param initialisationService
     */
    static handleChannelUpdateCallbacks(data: any, initialisationService: InitialisationService) {
        for (const callback of initialisationService.channelUpdateCallbacks) {
            callback(data);
        }
    }

    static walletnodeInitialisation(ngRedux: NgRedux<any>,
                                    walletNodeRequestService: WalletNodeRequestService,
                                    walletId: number): boolean {

        // Set requested data states to false
        this.clearWalletNodeRequestedStates(ngRedux);

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
        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_ADDRESSES],
            [],
            asyncTaskPipes, {}
        ));

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
        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_HOLDING],
            [],
            asyncTaskPipes,
            {},
            function (data) {
            },

            function (data) {
            }
        ));

        return false;
    }

    static requestAllInstruments(ngRedux: NgRedux<any>,
                                 walletNodeRequestService: WalletNodeRequestService) {
        ngRedux.dispatch(setRequesteAllInstruments());

        // Create a saga pipe.
        const asyncTaskPipes = walletNodeRequestService.walletInstrumentRequest({
            walletId: 0
        });

        // Send a saga action.
        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_ALL_INSTRUMENTS_LIST],
            [],
            asyncTaskPipes,
            {},
            function (data) {
                const test = data;
                console.log(test);
            },

            function (data) {
                const test = data;
                console.log(test);
            }
        ));

        return false;
    }

    static membernodeInitialisation(ngRedux: NgRedux<any>,
                                    myWalletsService: MyWalletsService,
                                    memberSocketService: MemberSocketService,
                                    channelService: ChannelService,
                                    accountsService: AccountsService,
                                    myUserService: MyUserService,
                                    permissionGroupService: PermissionGroupService,
                                    chainService: ChainService,
                                    initialisationService: InitialisationService): boolean {
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

        // Request User Details
        this.requestUserDetails(ngRedux, myUserService);

        // Request my chain access
        this.requestMyChainAccess(ngRedux, chainService);

        // Subscribe to my connection channel, target for my userId.
        this.subscribe(memberSocketService, channelService, initialisationService);

        return true;
    }

    static requestUserDetails(ngRedux: NgRedux<any>,
                              myUserService: MyUserService) {

        // Create a saga pipe.
        const asyncTaskPipes = myUserService.requestMyUserDetails();

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        // Saga pipe function arguments.
        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_USER_DETAILS],
            [],
            asyncTaskPipes, {}));

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

        ngRedux.dispatch(setRequestedAccountList());

        const asyncTaskPipes = accountsService.requestAccountList();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_ACCOUNT_LIST],
            [],
            asyncTaskPipes,
            {}
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
            {}
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
            {}
        ));

        return true;
    }

    /**
     * Request wallet instruments.
     * @param ngRedux
     * @param walletNodeRequestService
     * @param walletId
     */
    static requestWalletInstruments(ngRedux: NgRedux<any>,
                                    walletNodeRequestService: WalletNodeRequestService,
                                    walletId: number): void {

        // Create a saga pipe.
        const asyncTaskPipe = walletNodeRequestService.walletInstrumentRequest({
            walletId
        });

        // Send a saga action.
        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_MY_INSTRUMENTS_LIST],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    /**
     * Request To-relationship.
     * @param ngRedux
     * @param myWalletsService
     * @param walletId
     */
    static requestToRelationship(ngRedux: NgRedux<any>,
                                 myWalletsService: MyWalletsService,
                                 walletId: number): void {

        // Create a saga pipe.
        const asyncTaskPipe = myWalletsService.requestWalletToRelationship({
            walletId
        });

        // Send a saga action.
        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_TO_RELATIONSHIP],
            [],
            asyncTaskPipe,
            {}
        ));
    }

    /**
     * Clear (set to false) the walletnode requested states.
     * So the component will request the data, when they need it.
     * @param ngRedux
     */
    static clearWalletNodeRequestedStates(ngRedux: NgRedux<any>): void {

        // clear (set to false) the state of requested wallet issuers
        ngRedux.dispatch(clearRequestedWalletIssuer());

        // clear (set to false) the state of requested wallet instruments
        ngRedux.dispatch(clearRequestedWalletInstrument());

        // clear (set to false) the state of requested wallet address
        ngRedux.dispatch(clearRequestedWalletAddresses());

        // clear (set to false) the state of requested wallet address label
        ngRedux.dispatch(clearRequestedWalletLabel());

        // clear (set to false) the state of requested wallet holding
        ngRedux.dispatch(clearRequestedWalletHolding());

        // clear (set to false) the state of requested all instruments
        ngRedux.dispatch(clearRequestedAllInstruments());
    }

    /**
     * Using 'block' update from wallet node.
     *
     * Update tx that made to wallet node from frontend, waiting block come in an update
     * status. for example set inBlockchain flag to true, and set needHandle flag to true.
     *
     * @param ngRedux
     * @param data
     */
    static updatedWalletNodeTxStateWithBlock(ngRedux: NgRedux<any>, data) {
        const txList = _.get(data, 'Data.Transactions', []);

        for (const tx of txList) {
            const txType = tx[2];
            // todo
            // change to a switch statement of some sort, and store tx type in a constant
            if (txType === 4) {
                ngRedux.dispatch(updateLastCreatedRegisterIssuerDetail(tx));
            }
        }
    }

    /**
     * Using 'blockchanges' update from wallet node.
     *
     * Update tx that made to wallet node from frontend, waiting block come in an update
     * status. for example set inBlockchain flag to true, and set needHandle flag to true.
     *
     * @param ngRedux
     * @param data
     */
    static updatedWalletNodeTxStateWithBlockChange(ngRedux: NgRedux<any>, data) {
        ngRedux.dispatch(updateLastCreatedContractDetail(data));

    }

    /**
     * Default static call to get my chain access, and dispatch default actions, and other
     * default task.
     *
     * @param chainService
     * @param ngRedux
     */
    static requestMyChainAccess(ngRedux: NgRedux<any>, chainService: ChainService) {
        // Set the state flag to true. so we do not request it again.
        ngRedux.dispatch(setRequestedMyChainAccess());

        // Request the list.
        const asyncTaskPipe = chainService.requestMyChainAccess();

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_MY_CHAIN_ACCESS],
            [],
            asyncTaskPipe,
            {}
        ));
    }
}
