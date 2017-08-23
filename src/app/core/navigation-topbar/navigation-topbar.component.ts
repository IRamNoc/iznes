import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {
    getMyWalletList,

} from '@setl/core-store';
import {List, Map, fromJS} from 'immutable';

import {MyWalletsService, WalletNodeRequestService} from '@setl/core-req-services';
import {SagaHelper} from '@setl/utils';

// setActiveWallet

@Component({
    selector: 'app-navigation-topbar',
    templateUrl: './navigation-topbar.component.html',
    styleUrls: ['./navigation-topbar.component.css']
})
export class NavigationTopbarComponent implements OnInit {

    walletSelectItems: Array<any>;

    @Output() toggleSidebar: EventEmitter<any> = new EventEmitter();

    constructor(private ngRedux: NgRedux<any>,
                private myWalletsService: MyWalletsService,
                private walletNodeRequestService: WalletNodeRequestService) {
        ngRedux.subscribe(() => this.updateState());
        this.updateState();
    }

    updateState() {
        const newState = this.ngRedux.getState();
        const currentWalletsList = getMyWalletList(newState);

        this.walletSelectItems = walletListToSelectItem(currentWalletsList);
    }

    ngOnInit() {
    }

    public callToggleSidebar(event) {
        this.toggleSidebar.emit(event);
    }

    public selected(value: any): void {
        console.log('Selected value is: ', value);

        // Create a saga pipe.
        const asyncTaskPipe = this.myWalletsService.setActiveWallet(
            value
        );

        // Send a saga action.
        // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // saga pipe function descriptor.
        // Saga pipe function arguments.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe, {},
            function (data) {
                console.log('success')
                console.log(data);
            },
            function (data) {
                console.log('error')
                console.log(data);
            })
        );

        // // Create a saga pipe.
        // const asyncTaskPipes = this.walletNodeRequestService.walletAddressRequest({
        //     walletId: 191,
        // });
        //
        // // Send a saga action.
        // // Actions to dispatch, when request success:  LOGIN_SUCCESS.
        // // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
        // // saga pipe function descriptor.
        // // Saga pipe function arguments.
        // this.ngRedux.dispatch(SagaHelper.runAsync(
        //     [],
        //     [],
        //     asyncTaskPipes,
        //     {},
        //     function (data) {
        //         console.log('got address')
        //         console.log(data);
        //     }
        // ));
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
function walletListToSelectItem(walletsList: Array<any>): Array<any> {
    const walletListImu = fromJS(walletsList);
    const walletsSelectItem = walletListImu.map(
        (thisWallet) => {
            return {
                id: thisWallet.get('walletId'),
                text: thisWallet.get('walletName')
            };
        }
    );

    return walletsSelectItem.toJS();
}
