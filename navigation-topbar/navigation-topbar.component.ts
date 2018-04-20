import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {APP_CONFIG, AppConfig, MenuItem, SagaHelper} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import {
    clearRequestedMailInitial,
    clearRequestedWalletLabel,
    getAuthentication,
    getDefaultMyChainAccess,
    getMyDetail,
    getMyWalletList,
    SET_MESSAGE_COUNTS,
    setConnectedChain,
    setConnectedWallet,
    setMenuShown,
    setRequestedMailInitial,
    addWalletNodeInitialSnapshot
} from '@setl/core-store';
import {fromJS} from 'immutable';
import {MultilingualService} from '@setl/multilingual/multilingual.service';
import * as _ from 'lodash';

import {
    InitialisationService,
    MyMessagesService,
    MyUserService,
    MyWalletsService,
    WalletNodeRequestService
} from '@setl/core-req-services';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MemberSocketService, WalletNodeSocketService} from '@setl/websocket-service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-navigation-topbar',
    templateUrl: './navigation-topbar.component.html',
    styleUrls: ['./navigation-topbar.component.scss'],
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
    topbarLogoUrl: string;
    profileMenu: Array<MenuItem>;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    public hasMail = {};
    public unreadMessageCount;

    public currentUserDetails;
    public username;
    public lastLogin;
    public menuState;

    @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

    @select(['message', 'myMessages', 'requestMailInitial']) requestMailInitial;
    @select(['message', 'myMessages', 'counts', 'inboxUnread']) inboxUnread;
    @select(['user', 'connected', 'memberNodeSessionManager']) memberNodeSessionManagerOb;
    @select(['user', 'siteSettings', 'menuShown']) menuShowOb;

    constructor(private ngRedux: NgRedux<any>,
                private myWalletsService: MyWalletsService,
                private messageService: MyMessagesService,
                private walletNodeRequestService: WalletNodeRequestService,
                private fb: FormBuilder,
                private router: Router,
                private _myUserService: MyUserService,
                private walletNodeSocketService: WalletNodeSocketService,
                private changeDetectorRef: ChangeDetectorRef,
                private multilingualService: MultilingualService,
                private memberSocketService: MemberSocketService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        // Search form
        this.searchForm = fb.group({});

        this.connectedToWalletNode = false;

        this.appConfig = appConfig;
        this.topbarLogoUrl = this.appConfig.topbarLogoUrl;
        this.showCountdownModal = false;
        this.unreadMessageCount = 0;

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
            this.lastLogin = Date.now();
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

            this.walletNodeSocketService.connectToNode(protocol, hostName, port, nodePath, userId, apiKey)
                .then((res) => {
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

                        /* set the chain id as the connected one in redux store */
                        const chainId = _.get(chainAccess, 'chainId', '');
                        this.ngRedux.dispatch(setConnectedChain(chainId));

                        this.changeDetectorRef.markForCheck();
                    }

                    this.walletNodeRequestService.requestWalletNodeInitialSnapshot().then((initialSnapshot : any) => {
                        let action = addWalletNodeInitialSnapshot(initialSnapshot);
                        this.ngRedux.dispatch(action);
                    });
                });

        }

    }

    ngOnInit() {
        this.subscriptionsArray.push(this.multilingualService.getLanguage.subscribe((data) => {
            const currentState = this.ngRedux.getState();
            const currentUserDetails = getMyDetail(currentState);
            const userType = currentUserDetails.userType;
            const userTypeStr = {
                '15': 'system_admin',
                '25': 'chain_admin',
                '27': 'bank',
                '35': 'member_user',
                '36': 'am',
                '45': 'standard_user',
                '46': 'investor',
                '47': 'valuer',
                '48': 'custodian',
                '49': 'cac',
                '50': 'registrar',
                '60': 't2s',
                '65': 'rooster_operator',
            }[userType];
            this.profileMenu = this.appConfig.menuSpec.top.profile[userTypeStr];
        }));

        // When membernode reconnect. trigger wallet select.
        this.subscriptionsArray.push(this.memberSocketService.getReconnectStatus().subscribe(() =>
            this.selected(this.selectedWalletId.value[0])));
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

        this.subscriptionsArray.push(this.menuShowOb.subscribe(
            (menuState) => {
                this.menuState = menuState;
                this.menuHasChanged();
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

        console.log(window.innerWidth);

        this.ngRedux.dispatch(setMenuShown(true));
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

        this.unreadMessageCount = unreadMessages;

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

    controlMenu() {
        console.log('menu pressed');

        if (this.menuState) {
            this.ngRedux.dispatch(setMenuShown(false));
        } else {
            this.ngRedux.dispatch(setMenuShown(true));
        }
    }

    menuHasChanged() {
        console.log('menu has changed');
        console.log(this.menuState);
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
