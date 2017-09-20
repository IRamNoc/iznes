import {Component, OnInit, Output, EventEmitter, Inject} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {
    getMyWalletList,
    setConnectedWallet,
    getMyDetail,
    getDefaultMyChainAccess,
    getAuthentication
} from '@setl/core-store';
import {List, Map, fromJS} from 'immutable';
import _ from 'lodash';

import {MyWalletsService, WalletNodeRequestService, InitialisationService} from '@setl/core-req-services';
import {SagaHelper, APP_CONFIG, AppConfig} from '@setl/utils';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {WalletNodeSocketService} from '@setl/websocket-service';


// setActiveWallet

@Component({
    selector: 'app-navigation-topbar',
    templateUrl: './navigation-topbar.component.html',
    styleUrls: ['./navigation-topbar.component.css']
})
export class NavigationTopbarComponent implements OnInit {

    walletSelectItems: Array<any>;
    searchForm: FormGroup;
    selectedWalletId = new FormControl();

    connectedToWalletNode: boolean;

    appConfig: AppConfig;

    public currentUserDetails;
    public username;

    @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

    constructor(private ngRedux: NgRedux<any>,
                private myWalletsService: MyWalletsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private fb: FormBuilder,
                private walletNodeSocketService: WalletNodeSocketService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        // Search form
        this.searchForm = fb.group({});

        this.connectedToWalletNode = false;

        this.appConfig = appConfig;

        ngRedux.subscribe(() => this.updateState());
        this.updateState();

    }


    updateState() {
        const newState = this.ngRedux.getState();
        const currentWalletsList = getMyWalletList(newState);

        this.walletSelectItems = walletListToSelectItem(currentWalletsList);

        this.currentUserDetails = getMyDetail(newState);
        this.username = this.currentUserDetails.firstName;


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
                }
            });

        }

    }

    ngOnInit() {
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
    }

    public removed(value: any): void {
        console.log('Removed value is: ', value);
    }

    logout() {
        this.ngRedux.dispatch({type: 'USER_LOGOUT'});
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
