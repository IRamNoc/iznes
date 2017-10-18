// Vendor
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {fromJS} from 'immutable';
import {Subscription} from 'rxjs/Subscription';
import {select, NgRedux} from '@angular-redux/store';
import _ from 'lodash';

// Internal
import {
    MyWalletsService,
    MemberService,
    WalletnodeTxService,
    WalletNodeRequestService,
    InitialisationService,
} from '@setl/core-req-services';
import {
    SET_WALLET_ADDRESSES,
    SET_WALLET_LABEL,
    setRequestedWalletLabel,
    clearRequestedWalletLabel,
    setRequestedWalletAddresses,
    clearRequestedWalletAddresses
} from '@setl/core-store';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {SagaHelper, immutableHelper, mDateHelper} from '@setl/utils';
import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';

@Component({
    selector: 'app-nav',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiManageOfiNavComponent implements OnInit, OnDestroy {
    assetListObj: any;
    assetList: Array<any>;

    navList: Array<any>;
    allowSearchTypes: Array<any> = [
        {
            id: 'byFund',
            text: 'Fund'
        },
        {
            id: 'byDate',
            text: 'Date'
        }
    ];

    // Date picker configuration
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'DD-MM-YYYY',
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',
    };

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    tabDetail: any;

    connectedWalletId: number;

    // Search form
    searchForm: FormGroup;
    searchBy: string;
    selectedFund: FormControl;
    navDate: string;

    // List of Redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['ofi', 'ofiCorpActions', 'ofiUserAssets', 'requested']) requestedUserIssuedAssetsOb;
    @select(['ofi', 'ofiCorpActions', 'ofiUserAssets', 'ofiUserAssetList']) userIssuedAssetsOb;

    constructor(private _ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private _changeDetectorRef: ChangeDetectorRef,
                private _ofiCorpActionService: OfiCorpActionService) {
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    ngOnInit() {

        /* tab meta */
        this.tabDetail = {
            title: {
                text: 'Manage NAV',
                icon: '<i class="fa fa-industry">'
            }
        };

        // search formGroup
        this.searchBy = 'byDate';
        this.selectedFund = new FormControl([]);
        const currentDate = mDateHelper.getCurrentUnixTimestampStr('DD/MM/YYYY');
        this.navDate = new FormControl('');

        this.searchForm = new FormGroup({
            searchBy: new FormControl([{id: 'byData', text: 'Date'}]),
            fundName: this.selectedFund,
            navDate: this.navDate
        });

        this.connectedWalletId = 0;

        // Reduce observable subscription
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));
        this.subscriptionsArray.push(this.requestedUserIssuedAssetsOb.subscribe(requested => {
            this.requestUserIssuedAssets(requested);
        }));
        this.subscriptionsArray.push(this.userIssuedAssetsOb.subscribe(assetList => {
            this.updateUserIssuedAssets(assetList);
        }));

        this.navList = [
            {
                fundName: 'LEI00001|OFI RS Dynamique C D',
                fundIsin: 'FR0000970097',
                date: '2017-10-16',
                nav: 122000,
                status: -1
            },
            {
                fundName: 'LEI00001|OFI RS Dynamique C D',
                fundIsin: 'FR0000970097',
                date: '2017-10-17',
                nav: 132000,
                status: 1
            },

        ];
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     * @return void
     */
    requestUserIssuedAssets(requested): void {
        if (!requested) {
            OfiCorpActionService.defaultRequestUserIssuedAsset(this._ofiCorpActionService, this._ngRedux);
        }
    }

    /**
     * update asset list
     *
     * @param assetList
     */
    updateUserIssuedAssets(assetList): void {
        this.assetListObj = assetList;

        this.assetList = immutableHelper.reduce(assetList, (result, item) => {
            result.push({
                id: item.get('asset', ''),
                text: item.get('asset', '')
            });
            return result;
        }, []);

        // Set default or selected address.
        const hasSelectedFundInList = immutableHelper.filter(this.assetList, (thisItem) => {
            return thisItem.get('id') === this.selectedFund && this.selectedFund.value.length > 0 && this.selectedFund.value[0].id;
        });


        if (this.assetList.length > 0) {
            if (!this.selectedFund || hasSelectedFundInList.length === 0) {
                console.log('selecting', this.assetList[0]);
                this.selectedFund.setValue([this.assetList[0]], {
                    onlySelf: true,
                    emitEvent: true,
                    emitModelToViewChange: true,
                    emitViewToModelChange: true
                });
            } else {
                this.selectedFund.setValue([this.selectedFund.value[0]], {
                    onlySelf: true,
                    emitEvent: true,
                    emitModelToViewChange: true,
                    emitViewToModelChange: true
                });
            }
        }

        this._changeDetectorRef.markForCheck();
    }

    selectSearchBy(searchBy) {
        this.searchBy = searchBy.id;
        this._changeDetectorRef.markForCheck();
        console.log(this.searchForm.value);
    }

    handleSearchSubmit() {
        console.log(this.searchForm.value);
    }

    /**
     * Handle Add new profile click.
     *
     */
    handleAddProfile(): void {

    }

    handleEditSubPortfolio(address): void {
    }

    /**
     * Handle edit button is clicked.
     * @param index
     */
    handleEdit(address): void {
        // this.addressList = immutableHelper.map(this.addressList, (addressEntry) => {
        //     if (addressEntry.get('address', '') === address) {
        //         return addressEntry.set('editing', true);
        //     }
        //     return addressEntry;
        //
        // });
    }

    /**
     * Handle cancel button is clicked.
     * @param address
     */
    handleCancelEdit(address): void {
        // this.addressList = immutableHelper.map(this.addressList, (addressEntry) => {
        //     if (addressEntry.get('address', '') === address) {
        //         return addressEntry.set('editing', false);
        //     }
        //     return addressEntry;
        //
        // });
    }

    handleUpdateLabel(value, address) {

        // const asyncTaskPipe = this._myWalletService.updateWalletLabel({
        //     walletId: this.connectedWalletId,
        //     option: address,
        //     label: value
        // });
        // console.log(address);
        //
        // this.ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe,
        //     (data) => {
        //         this.showSuccessResponse('Portfolio name updated');
        //         this.ngRedux.dispatch(clearRequestedWalletLabel());
        //     }, (data) => {
        //         this.showErrorResponse(data);
        //     }));

    }

    showErrorResponse(response) {

        const message = _.get(response, '[1].Data[0].Message', '');

        this.alertsService.create('error', `
                    <table class="table grid">

                        <tbody>
                            <tr>
                                <td class="text-center text-danger">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

    showSuccessResponse(message) {

        this.alertsService.create('success', `
                    <table class="table grid">

                        <tbody>
                            <tr>
                                <td class="text-center text-success">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

}
