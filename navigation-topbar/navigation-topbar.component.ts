import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { APP_CONFIG, AppConfig, MenuItem, SagaHelper, LogService } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import {
    addWalletNodeInitialSnapshot,
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
} from '@setl/core-store';
import { fromJS } from 'immutable';
import { MultilingualService } from '@setl/multilingual/multilingual.service';
import * as _ from 'lodash';
import * as moment from 'moment';

import {
    ChannelService,
    InitialisationService,
    MyMessagesService,
    MyUserService,
    MyWalletsService,
    WalletNodeRequestService,
    NodeAlertsService
} from '@setl/core-req-services';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MemberSocketService, WalletNodeSocketService } from '@setl/websocket-service';
import { Router } from '@angular/router';
import { MenuSpecService } from '@setl/utils/services/menuSpec/service';
import { Subscription, Observable } from 'rxjs';

@Component({
    selector: 'app-navigation-topbar',
    templateUrl: './navigation-topbar.component.html',
    styleUrls: ['./navigation-topbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NavigationTopbarComponent implements OnInit, AfterViewInit, OnDestroy {
    walletSelectItems: any[];
    searchForm: FormGroup;
    selectedWalletId = new FormControl();

    connectedToWalletNode: boolean;

    remainingSecond: number;
    showCountdownModal: boolean;

    appConfig: AppConfig;
    topbarLogoUrl: string;
    profileMenu: MenuItem[];

    // List of observable subscription
    subscriptionsArray: Subscription[] = [];

    public hasMail = {};
    public unreadMessageCount;

    public currentUserDetails;
    public username;
    public lastLogin;
    public menuState;

    public missingTranslations = [];
    public responsesService = <any>[];
    showMissingTranslations = false;
    showHighlightTranslations = true;
    nbMaxTranslationsToProcess = 60;

    isSaving = false;

    @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

    @select(['message', 'myMessages', 'requestMailInitial']) requestMailInitial;
    @select(['message', 'myMessages', 'counts', 'inboxUnread']) inboxUnread;
    @select(['user', 'connected', 'memberNodeSessionManager']) memberNodeSessionManagerOb;
    @select(['user', 'siteSettings', 'menuShown']) menuShowOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    constructor(private ngRedux: NgRedux<any>,
                private myWalletsService: MyWalletsService,
                private messageService: MyMessagesService,
                private walletNodeRequestService: WalletNodeRequestService,
                private fb: FormBuilder,
                private router: Router,
                private myUserService: MyUserService,
                private walletNodeSocketService: WalletNodeSocketService,
                private changeDetectorRef: ChangeDetectorRef,
                public translate: MultilingualService,
                private memberSocketService: MemberSocketService,
                private channelService: ChannelService,
                private menuSpecService: MenuSpecService,
                private initialisationService: InitialisationService,
                private logService: LogService,
                private nodeAlertsService: NodeAlertsService,
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

        this.lastLogin = this.currentUserDetails.lastLogin || moment().format('YYYY-MM-DD HH:mm');

        const chainAccess = getDefaultMyChainAccess(newState);

        if (!this.connectedToWalletNode && chainAccess && this.walletSelectItems.length > 0) {

            this.connectedToWalletNode = true;

            const myAuthenData = getAuthentication(newState);
            const myDetail = getMyDetail(newState);
            const { userId } = myDetail;
            const { apiKey } = myAuthenData;
            const protocol = this.appConfig.production ? 'wss' : 'ws';
            const hostName = _.get(chainAccess, 'nodeAddress', '');
            const port = _.get(chainAccess, 'nodePort', 0);
            const nodePath = _.get(chainAccess, 'nodePath', '');

            this.walletNodeSocketService.connectToNode(protocol, hostName, port, nodePath, userId, apiKey)
            .then((res) => {
                // Set connected wallet, if we got the wallet list and
                // there is not wallet is chosen.
                if (this.walletSelectItems.length > 0 && !this.selectedWalletId.value) {
                    this.selectedWalletId.setValue([this.walletSelectItems[0]], {
                        onlySelf: true,
                        emitEvent: true,
                        emitModelToViewChange: true,
                        emitViewToModelChange: true,
                    });
                    this.logService.log(this.walletSelectItems[0]);
                    this.selected(this.walletSelectItems[0]);

                    /* set the chain id as the connected one in redux store */
                    const chainId = _.get(chainAccess, 'chainId', '');
                    this.ngRedux.dispatch(setConnectedChain(chainId));

                    this.changeDetectorRef.markForCheck();
                }

                this.walletNodeRequestService.requestWalletNodeInitialSnapshot().then((initialSnapshot: any) => {
                    const action = addWalletNodeInitialSnapshot(initialSnapshot);
                    this.ngRedux.dispatch(action);
                });
            });

        }
        this.changeDetectorRef.markForCheck();

    }

    ngOnInit() {
        this.subscriptionsArray.push(this.translate.getLanguage.subscribe((data) => {
            const currentState = this.ngRedux.getState();
            const currentUserDetails = getMyDetail(currentState);
            const userType = currentUserDetails.userType;
            const userTypeStr = {
                15: 'system_admin',
                25: 'chain_admin',
                27: 'bank',
                35: 'member_user',
                36: 'am',
                45: 'standard_user',
                46: 'investor',
                47: 'valuer',
                48: 'custodian',
                49: 'cac',
                50: 'registrar',
                60: 't2s',
                65: 'rooster_operator',
            }[userType];

            if (!this.profileMenu) {
                this.profileMenu = this.appConfig.menuSpec.top.profile[userTypeStr];
            }

            this.menuSpecService.getMenuSpec().subscribe((menuSpec) => {
                this.profileMenu = menuSpec.top.profile[userTypeStr];
            });
        }));

        // When membernode reconnect. trigger wallet select.
        this.subscriptionsArray.push(this.memberSocketService.getReconnectStatus().subscribe(() => {
                // Subscribe to my connection channel, target for my userId
                InitialisationService.subscribe(this.memberSocketService, this.channelService, this.initialisationService);

                if (!this.selectedWalletId.value) {
                    return;
                }

                this.selected(this.selectedWalletId.value[0]);
            }),
        );
    }

    ngAfterViewInit() {
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(
            (walletId) => {
                const selectedItem = this.walletSelectItems.find(
                    (walletItem) => {
                        return walletItem.id === walletId;
                    },
                );
                if (typeof selectedItem !== 'undefined') {
                    this.selectedWalletId.patchValue([selectedItem]);
                }
            },
            ),
        );
        this.subscriptionsArray.push(this.requestMailInitial.subscribe(
            (requestedState) => {
                this.requestMailInitialCounts(requestedState);
            },
        ));

        this.subscriptionsArray.push(this.inboxUnread.subscribe(
            (unreadMessages) => {
                this.triggerUnreadMessages(unreadMessages);
            },
        ));

        this.subscriptionsArray.push(this.menuShowOb.subscribe(
            (menuState) => {
                this.menuState = menuState;
                this.menuHasChanged();
            },
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

            },
        ));

        this.logService.log(window.innerWidth);

        this.ngRedux.dispatch(setMenuShown(true));
    }

    public getMissingTranslations() {
        // reset
        this.missingTranslations = [];
        this.responsesService = [];
        // get translation
        const tr = this.translate.getTranslations();
        // clone
        this.missingTranslations = _.clone(tr);
        this.showMissingTranslations = true;

        this.doHighlight();

        // this.changeDetectorRef.markForCheck();
        // this.changeDetectorRef.detectChanges();
    }

    doHighlight() {
        if (this.showHighlightTranslations) {
            this.highlightMissingTranslations();
        } else {
            this.translate.removeHighlightMissingTranslations();
        }
    }

    highlightMissingTranslations() {
        for (const tr of this.missingTranslations) {
            this.translate.replaceMissingTranslations(tr.translation);
        }
    }

    async generateTranslations() {
        if (this.missingTranslations.length > 0) {
            const nbMax1 = (this.missingTranslations.length > this.nbMaxTranslationsToProcess) ? this.nbMaxTranslationsToProcess : this.missingTranslations.length;
            if (nbMax1 > 0) {
                for (let i = 0; i < nbMax1; i++) {
                    this.responsesService.push({
                        response: await this.translate.addNewTranslation({
                            mltag: this.missingTranslations[i].mltag,
                            value: this.missingTranslations[i].original,
                            location: this.missingTranslations[i].from,
                        }),
                        translation: this.missingTranslations[i],
                    });
                }
                const nbMax2 = this.responsesService.length;
                if (nbMax2 > 0) {
                    const idList = [];
                    let trFound = undefined;
                    let ix = -1;
                    for (let i = 0; i < nbMax2; i++) {
                        if (this.responsesService[i].response.ok) {
                            trFound = this.missingTranslations.find((item) =>
                                item.original === this.responsesService[i].translation.original,
                            );
                            if (trFound !== undefined) {
                                ix = this.missingTranslations.indexOf(trFound);
                                if (ix !== -1 && ix !== undefined) {
                                    idList.push(ix);
                                }
                            }
                        }
                    }
                    if (idList.length > 0) {
                        for (let i = 0; i < idList.length; i++) {
                            this.missingTranslations.splice(idList[i] - i, 1);
                        }
                    }
                }
            }
        }
        this.isSaving = false;
        this.changeDetectorRef.markForCheck();
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
            'has-badge': messageState,
        };

        this.unreadMessageCount = unreadMessages;

        this.changeDetectorRef.markForCheck();
    }

    public callToggleSidebar(event) {
        this.toggleSidebar.emit(event);
    }

    public selected(value: any): void {
        this.logService.log('Selected value is: ', value);
        this.logService.log(this.selectedWalletId);

        // Set connected wallet in redux state.
        this.ngRedux.dispatch(setConnectedWallet(value.id));

        // Create a saga pipe.
        const asyncTaskPipe = this.myWalletsService.setActiveWallet(
            value.id,
        );

        // Get response from set active wallet
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe),
        );

        // // Request initial data from wallet node.
        InitialisationService.walletnodeInitialisation(
            this.ngRedux,
            this.walletNodeRequestService,
            value.id,
        );

        this.ngRedux.dispatch(clearRequestedMailInitial());
    }

    public removed(value: any): void {
        this.logService.log('Removed value is: ', value);
    }

    logout() {
        this.myUserService.logout();
    }

    controlMenu() {
        this.logService.log('menu pressed');

        if (this.menuState) {
            this.ngRedux.dispatch(setMenuShown(false));
        } else {
            this.ngRedux.dispatch(setMenuShown(true));
        }
    }

    menuHasChanged() {
        this.logService.log('menu has changed');
        this.logService.log(this.menuState);
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
                {},
            ));

        }
    }

    handleExtendSession() {
        this.myUserService.defaultRefreshToken();
    }
}

/**
 * Convert wallet Address to an array the select2 can use to render a list a wallet address.
 * @param walletsList
 * @return {any}
 */
function walletListToSelectItem(walletsList: object): any[] {
    const walletListImu = fromJS(walletsList);
    const walletsSelectItem = walletListImu.map(
        (thisWallet) => {
            return {
                id: thisWallet.get('walletId'),
                text: thisWallet.get('walletName'),
            };
        },
    );

    return walletsSelectItem.toArray();
}
