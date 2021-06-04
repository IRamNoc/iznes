import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    HostListener,
    ViewChild,
} from '@angular/core';
import { APP_CONFIG, AppConfig, MenuItem, SagaHelper, LogService } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import {
    addWalletNodeInitialSnapshot,
    clearRequestedMailInitial,
    getAuthentication,
    getDefaultMyChainAccess,
    getMyDetail,
    getMyWalletList,
    SET_MESSAGE_COUNTS,
    setConnectedChain,
    setConnectedWallet,
    setRequestedMailInitial,
} from '@setl/core-store';
import { fromJS } from 'immutable';
import { MultilingualService } from '@setl/multilingual/multilingual.service';
import { get, clone } from 'lodash';
import {
    ChannelService,
    InitialisationService,
    MyMessagesService,
    MyWalletsService,
    WalletNodeRequestService,
} from '@setl/core-req-services';
import { FormControl } from '@angular/forms';
import { MemberSocketService, WalletNodeSocketService } from '@setl/websocket-service';
import { MenuSpecService } from '@setl/utils/services/menuSpec/service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-navigation-topbar',
    templateUrl: './navigation-topbar.component.html',
    styleUrls: ['./navigation-topbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NavigationTopbarComponent implements OnInit, AfterViewInit, OnDestroy {
    public walletSelectItems: any[];
    public selectedWalletId: FormControl = new FormControl();
    public appConfig: AppConfig;
    public topbarLogoUrlLight: string;
    public profileMenu: MenuItem[];
    public showOverlay: boolean = false;
    public hasMail: {} = {};
    public unreadMessageCount: number = 0;
    public currentUserDetails: any;
    public username: string;
    public missingTranslations: any = [];
    public responsesService: any[] = <any>[];
    public showMissingTranslations: boolean = false;
    public showHighlightTranslations: boolean = true;
    public nbMaxTranslationsToProcess: number = 60;
    public isSaving: boolean = false;
    private walletSelectEl: any;
    private connectedToWalletNode: boolean = false;
    private subscriptionsArray: Subscription[] = [];

    @ViewChild('walletSelectSmall') walletSelectSmall;
    @ViewChild('walletSelectRight') walletSelectRight;
    @ViewChild('walletSelectCenter') walletSelectCenter;
    @ViewChild('blockchainStatusTracker') blockchainStatusTracker;

    @select(['message', 'myMessages', 'requestMailInitial']) requestMailInitial;
    @select(['message', 'myMessages', 'counts', 'inboxUnread']) inboxUnread;
    @select(['user', 'connected', 'memberNodeSessionManager']) memberNodeSessionManagerOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    constructor(
        private ngRedux: NgRedux<any>,
        private myWalletsService: MyWalletsService,
        private messageService: MyMessagesService,
        private walletNodeRequestService: WalletNodeRequestService,
        private walletNodeSocketService: WalletNodeSocketService,
        private changeDetectorRef: ChangeDetectorRef,
        public translate: MultilingualService,
        private memberSocketService: MemberSocketService,
        private channelService: ChannelService,
        private menuSpecService: MenuSpecService,
        private initialisationService: InitialisationService,
        private logService: LogService,
        @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
        this.topbarLogoUrlLight = this.appConfig.logoLightUrl || this.appConfig.logoUrl;
        ngRedux.subscribe(() => this.updateState());
        this.updateState();
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

            if (!this.selectedWalletId.value) return;

            this.selected(this.selectedWalletId.value[0]);
        }));
    }

    ngAfterViewInit() {
        // Set wallet element property based on config
        this.walletSelectEl = this.appConfig.walletPickerRight
            ? this.walletSelectRight.element.nativeElement
            : this.walletSelectCenter.element.nativeElement;

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
    }

    /**
     * Handle displaying the overlay for wallet select and blockchain status tracker
     * @param event
     */
    @HostListener('document:click', ['$event']) clickOutside(e) {
        const isSmall = !!this.walletSelectSmall.nativeElement.offsetHeight;
        const walletEl = isSmall ? this.walletSelectSmall.nativeElement : this.walletSelectEl;
        const walletBarEl = walletEl.querySelector('.ui-select-match');
        const statusEl = this.blockchainStatusTracker ? this.blockchainStatusTracker.el.nativeElement : false;
        const openStatusEl = statusEl ? statusEl.querySelector('.dropdown.active') : false;

        // Show for click on status tracker or wallet picker, but not if in wallet bar while status tracker is closed
        this.showOverlay = (statusEl && statusEl.contains(e.target)) || (walletEl.contains(e.target)
        && !(this.showOverlay && !openStatusEl && walletBarEl.contains(e.target)));
    }

    /**
     * Updates the state
     */
    updateState() {
        const newState = this.ngRedux.getState();
        const currentWalletsList = getMyWalletList(newState);

        this.walletSelectItems = this.walletListToSelectItem(currentWalletsList);

        this.currentUserDetails = getMyDetail(newState);
        this.username = this.currentUserDetails.firstName;

        if (this.username === '' || this.username === null) {
            this.username = this.currentUserDetails.username;
        }

        const chainAccess = getDefaultMyChainAccess(newState);

        if (!this.connectedToWalletNode && chainAccess && this.walletSelectItems.length > 0) {

            this.connectedToWalletNode = true;

            const myAuthenData = getAuthentication(newState);
            const myDetail = getMyDetail(newState);
            const { userId } = myDetail;
            const { apiKey } = myAuthenData;
            const protocol = this.appConfig.production ? 'wss' : 'ws';
            const hostName = get(chainAccess, 'nodeAddress', '');
            const port = get(chainAccess, 'nodePort', 0);
            const nodePath = get(chainAccess, 'nodePath', '');

            this.walletNodeSocketService.connectToNode(protocol, hostName, port, nodePath, userId, apiKey)
            .then((res) => {
                // Set connected wallet, if we got the wallet list and
                // there is not wallet is chosen.
                if (this.walletSelectItems.length > 0 && !this.selectedWalletId.value) {
                    const defaultWalletId = _.min(_.map(this.walletSelectItems,'id'));
                    const selectedItem = _.find(this.walletSelectItems, { id: defaultWalletId });
                    this.selectedWalletId.setValue([selectedItem], {
                        onlySelf: true,
                        emitEvent: true,
                        emitModelToViewChange: true,
                        emitViewToModelChange: true,
                    });

                    this.selected(this.walletSelectItems[0]);

                    /* set the chain id as the connected one in redux store */
                    const chainId = get(chainAccess, 'chainId', '');
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

    /**
     * Sets the selected wallet ID
     * @param value
     */
    public selected(value: any): void {
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

        // Request initial data from wallet node.
        InitialisationService.walletnodeInitialisation(
            this.ngRedux,
            this.walletNodeRequestService,
            value.id,
        );

        this.ngRedux.dispatch(clearRequestedMailInitial());
    }

    /**
     * Logs removed wallet ID
     * @param value
     */
    public removed(value: any): void {
        this.logService.log('Removed value is: ', value);
    }

    /**
     * Handles requesting mail counts
     * @param requestedState
     */
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

    /**
     * Trigger Unread Messages
     * @param unreadMessages
     */
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

    /**
     * Convert wallet Address to an array the select2 can use to render a list a wallet address.
     * @param walletsList
     * @return {any}
     */
    walletListToSelectItem(walletsList: object): any[] {
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

    /**
     * Requests Missing Translations
     */
    public getMissingTranslations() {
        // reset
        this.missingTranslations = [];
        this.responsesService = [];
        // get translation
        const tr = this.translate.getTranslations();
        // clone
        this.missingTranslations = clone(tr);
        this.showMissingTranslations = true;

        this.doHighlight();
    }

    /**
     * Handles highlighting translations
     */
    doHighlight() {
        if (this.showHighlightTranslations) {
            this.highlightMissingTranslations();
        } else {
            this.translate.removeHighlightMissingTranslations();
        }
    }

    /**
     * Highlights missing translations
     */
    highlightMissingTranslations() {
        for (const tr of this.missingTranslations) {
            this.translate.replaceMissingTranslations(tr.translation);
        }
    }

    /**
     * Saves translations to the DB
     */
    async generateTranslations() {
        if (this.missingTranslations.length > 0) {
            const nbMax1 = (this.missingTranslations.length > this.nbMaxTranslationsToProcess)
            ? this.nbMaxTranslationsToProcess : this.missingTranslations.length;
            if (nbMax1 > 0) {
                for (let i = 0; i < nbMax1; i += 1) {
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
                    for (let i = 0; i < nbMax2; i += 1) {
                        if (this.responsesService[i].response.ok) {
                            trFound = this.missingTranslations.find(item =>
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
                        for (let i = 0; i < idList.length; i += 1) {
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
}
