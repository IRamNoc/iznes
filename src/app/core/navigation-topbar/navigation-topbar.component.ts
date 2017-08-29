import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {
    getMyWalletList,
    setConnectedWallet
} from '@setl/core-store';
import {List, Map, fromJS} from 'immutable';

import {MyWalletsService, WalletNodeRequestService, InitialisationService} from '@setl/core-req-services';
import {SagaHelper} from '@setl/utils';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';

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

    @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

    constructor(private ngRedux: NgRedux<any>,
                private myWalletsService: MyWalletsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private fb: FormBuilder) {
        ngRedux.subscribe(() => this.updateState());
        this.updateState();

        // Search form
        this.searchForm = fb.group({});
    }

    updateState() {
        const newState = this.ngRedux.getState();
        const currentWalletsList = getMyWalletList(newState);

        this.walletSelectItems = walletListToSelectItem(currentWalletsList);

        // Set connected wallet, if we got the wallet list and there is not wallet is chosen.
        if (this.walletSelectItems.length > 0 && !this.selectedWalletId.value) {
            this.selectedWalletId.setValue([this.walletSelectItems[0]], {
                onlySelf: true,
                emitEvent: true,
                emitModelToViewChange: true,
                emitViewToModelChange: true
            });
            this.selected(this.walletSelectItems[0]);
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
            asyncTaskPipe,
            function (data) {
                console.log(data); // success
            },
            function (data) {
                console.log(data); // error
            })
        );

        // Request initial data from wallet node.
        InitialisationService.walletnodeInitialisation(this.ngRedux, this.walletNodeRequestService, value.id);
    }

    public removed(value: any): void {
        console.log('Removed value is: ', value);
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
