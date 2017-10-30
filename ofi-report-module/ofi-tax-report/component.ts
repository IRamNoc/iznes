import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {NgRedux, select} from '@angular-redux/store';
import {OfiClientTxService} from '../../ofi-req-services/ofi-client-tx/service';
import {setRequestedClientTxList} from "../../ofi-store/ofi-client-txs/ofi-client-tx-list/actions";

@Component({
    selector: 'app-ofi-tax-report',
    templateUrl: 'component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiTaxReportComponent implements OnInit, OnDestroy {
    tabsControl: Array<any>;

    connectedWalletId: number;

    // client txt data
    clientTxListObj: any;
    clientTxList: Array<any>;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    assetBalances: Array<any>;

    // List of redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['ofi', 'ofiClientTx', 'ofiClientTxList', 'txList']) clientTxListOb;
    @select(['ofi', 'ofiClientTx', 'ofiClientTxList', 'requested']) clientTxListRequestedOb;

    constructor(private _ngRedux: NgRedux<any>,
                private _ofiClientTxService: OfiClientTxService) {
    }

    ngOnDestroy() {

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    ngOnInit() {

        /**
         * Default tabs.
         */
        this.tabsControl = [
            {
                title: {
                    icon: 'fa-search',
                    text: 'Search',
                    colorClass: ''
                },
                active: true
            }
        ];

        this.assetBalances = [
            {
                fundName: 'fund 1',
                balance: 1000,
                disposalGainLoss: 100,
                unrealisedGainLoss: 1000
            },
            {
                fundName: 'fund 2',
                balance: 2000,
                disposalGainLoss: 4100,
                unrealisedGainLoss: 81000
            }
        ];

        // List of observable subscription.
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));
        this.subscriptionsArray.push(this.clientTxListRequestedOb.subscribe(requested => this.requestClientTx(requested)));
        this.subscriptionsArray.push(this.clientTxListOb.subscribe(clientTxList => {
            this.updateClientTxList(clientTxList);
        }));
    }

    requestClientTx(requestedState: boolean) {

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this._ngRedux.dispatch(setRequestedClientTxList());

            // Request the list.
            OfiClientTxService.defaultRequestWalletClientTxs(this._ofiClientTxService, this._ngRedux,
                this.connectedWalletId, '');
        }
    }

    updateClientTxList(clientTxListData) {
        this.clientTxListObj = clientTxListData;
    }
}

