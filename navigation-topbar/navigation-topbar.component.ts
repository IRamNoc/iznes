import {
    Component, OnInit, Output, EventEmitter, Inject, ChangeDetectionStrategy,
    ChangeDetectorRef, AfterViewInit, OnDestroy
} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {
    getMyWalletList,
    setConnectedWallet,
    getMyDetail,
    getDefaultMyChainAccess,
    getAuthentication,
    setRequestedMailInitial,
    SET_MESSAGE_COUNTS,
    clearRequestedMailInitial,
    clearRequestedWalletLabel
} from '@setl/core-store';
import {List, Map, fromJS} from 'immutable';
import _ from 'lodash';

import {
    MyWalletsService,
    WalletNodeRequestService,
    InitialisationService,
    MyMessagesService,
    MyUserService
} from '@setl/core-req-services';
import {SagaHelper, APP_CONFIG, AppConfig} from '@setl/utils';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {WalletNodeSocketService} from '@setl/websocket-service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-navigation-topbar',
    templateUrl: './navigation-topbar.component.html',
    styleUrls: ['./navigation-topbar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationTopbarComponent implements OnInit, AfterViewInit, OnDestroy {

    walletSelectItems: Array<any>;
    searchForm: FormGroup;
    selectedWalletId = new FormControl();

    connectedToWalletNode: boolean;

    remainingSecond: number;
    showCountdownModal: boolean;

    appConfig: AppConfig;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    public hasMail = {};

    public currentUserDetails;
    public username;
    public lastLogin;

    @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

    @select(['message', 'myMessages', 'requestMailInitial']) requestMailInitial;
    @select(['message', 'myMessages', 'counts', 'inboxUnread']) inboxUnread;
    @select(['user', 'connected', 'memberNodeSessionManager']) memberNodeSessionManagerOb;

    constructor(private ngRedux: NgRedux<any>,
                private myWalletsService: MyWalletsService,
                private messageService: MyMessagesService,
                private walletNodeRequestService: WalletNodeRequestService,
                private fb: FormBuilder,
                private router: Router,
                private _myUserService: MyUserService,
                private walletNodeSocketService: WalletNodeSocketService,
                private changeDetectorRef: ChangeDetectorRef,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        // Search form
        this.searchForm = fb.group({});

        this.connectedToWalletNode = false;

        this.appConfig = appConfig;
        this.showCountdownModal = false;

        ngRedux.subscribe(() => this.updateState());
        this.updateState();

    }


    updateState() {
        const newState = this.ngRedux.getState();
        const currentWalletsList = getMyWalletList(newState);

        this.walletSelectItems = walletListToSelectItem(currentWalletsList);

        this.currentUserDetails = getMyDetail(newState);
        this.username = this.currentUserDetails.firstName;

        if (this.username === '' || this.username === null) {
            this.username = this.currentUserDetails.username;
        }

        this.lastLogin = this.currentUserDetails.lastLogin;

        if (this.lastLogin === '' || this.lastLogin === null) {
            this.lastLogin = 'Never';
        }

        const chainAccess = getDefaultMyChainAccess(newState);

        if (!this.connectedToWalletNode && chainAccess) {

            this.connectedToWalletNode = true;

            const myAuthenData = getAuthentication(newState);
            const myDetail = getMyDetail(newState);
            const {userId} = myDetail;
            const {apiKey} = myAuthenData;
            const protocol = this.appConfig.production ? 'wss' : 'ws';
            const hostName = _.get(chainAccess, 'nodeAddress', '');
            const port = _.get(chainAccess, 'nodePort', 0);
            const nodePath = _.get(chainAccess, 'nodePath', '');

            this.walletNodeSocketService.connectToNode(protocol, hostName, port, nodePath, userId, apiKey).then(() => {
                // Set connected wallet, if we got the wallet list and there is not wallet is chosen.

                if (this.walletSelectItems.length > 0 && !this.selectedWalletId.value) {
                    this.selectedWalletId.setValue([this.walletSelectItems[0]], {
                        onlySelf: true,
                        emitEvent: true,
                        emitModelToViewChange: true,
                        emitViewToModelChange: true
                    });
                    console.log(this.walletSelectItems[0]);
                    this.selected(this.walletSelectItems[0]);

                    this.changeDetectorRef.markForCheck();
                }
            });

        }

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.subscriptionsArray.push(this.requestMailInitial.subscribe(
            (requestedState) => {
                this.requestMailInitialCounts(requestedState);
            }
        ));

        this.subscriptionsArray.push(this.inboxUnread.subscribe(
            (unreadMessages) => {
                this.triggerUnreadMessages(unreadMessages);
            }
        ));

        this.subscriptionsArray.push(this.memberNodeSessionManagerOb.subscribe(
            (memberNodeSessionManager) => {
                this.showCountdownModal = _.get(memberNodeSessionManager, 'startCountDown', 0);

                const remainingSecond = _.get(memberNodeSessionManager, 'remainingSecond', 0);
                this.remainingSecond = remainingSecond;

                if (remainingSecond <= 0) {
                    this.router.navigateByUrl('');
                    this.logout();
                }

                this.changeDetectorRef.detectChanges();
            }
        ));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    public triggerUnreadMessages(unreadMessages) {

        let messageState = false;

        if (unreadMessages > 0) {
            messageState = true;
        }

        this.hasMail = {
            'has-badge': messageState
        };

        this.changeDetectorRef.markForCheck();
    }

    public callToggleSidebar(event) {
        this.toggleSidebar.emit(event);
    }

    public selected(value: any): void {
        console.log('Selected value is: ', value);
        console.log(this.selectedWalletId);

        // Set connected wallet in redux state.
        this.ngRedux.dispatch(setConnectedWallet(value.id));


        // Create a saga pipe.
        const asyncTaskPipe = this.myWalletsService.setActiveWallet(
            value.id
        );

        // Get response from set active wallet
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe)
        );

        // // Request initial data from wallet node.
        InitialisationService.walletnodeInitialisation(this.ngRedux, this.walletNodeRequestService, value.id);

        this.ngRedux.dispatch(clearRequestedMailInitial());

        this.ngRedux.dispatch(clearRequestedWalletLabel());
    }

    public removed(value: any): void {
        console.log('Removed value is: ', value);
    }

    logout() {
        this.ngRedux.dispatch({type: 'USER_LOGOUT'});
    }

    requestMailInitialCounts(requestedState: boolean): void {

        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedMailInitial());

            // Request the list.
            const asyncTaskPipe = this.messageService.requestMailInit(this.selectedWalletId.value[0].id);

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_MESSAGE_COUNTS],
                [],
                asyncTaskPipe,
                {}
            ));

        }
    }

    handleExtendSession() {
        this._myUserService.defaultRefreshToken(this.ngRedux);
    }
}

/**
 * Convert wallet Address to an array the select2 can use to render a list a wallet address.
 * @param walletAddressList
 * @return {any}
 */
function walletListToSelectItem(walletsList: object): Array<any> {
    const walletListImu = fromJS(walletsList);
    const walletsSelectItem = walletListImu.map(
        (thisWallet) => {
            return {
                id: thisWallet.get('walletId'),
                text: thisWallet.get('walletName')
            };
        }
    );

    return walletsSelectItem.toArray();
}
