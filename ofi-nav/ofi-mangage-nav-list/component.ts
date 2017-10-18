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
import {OfiNavService} from '../../ofi-req-services/ofi-product/nav/service';
import {NavStatus} from '../../ofi-req-services/ofi-product/nav/model';
import {OfiCorpActionService} from '../../ofi-req-services/ofi-corp-actions/service';
import {
    ofiSetCurrentManageNavRequest,
    clearRequestedManageNavList,
    getOfiManageNavListCurrentRequest
} from '../../ofi-store/ofi-product/nav';
import * as moment from 'moment';

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
    navDate: FormControl;

    // List of Redux observable.
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['ofi', 'ofiCorpActions', 'ofiUserAssets', 'requested']) requestedUserIssuedAssetsOb;
    @select(['ofi', 'ofiCorpActions', 'ofiUserAssets', 'ofiUserAssetList']) userIssuedAssetsOb;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiManageNavList', 'requested']) navRequestedOb;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiManageNavList', 'navList']) navListOb;

    constructor(private _ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private _ofiNavService: OfiNavService,
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
        this.navDate = new FormControl(currentDate);

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

        this.subscriptionsArray.push(this.navRequestedOb.subscribe(requested => {
            this.requestNavList(requested);
        }));

        this.subscriptionsArray.push(this.navListOb.subscribe(navList => {
            this.updateNavList(navList);
        }));

        this.navList = [];
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

    requestNavList(requested) {
        if (!requested) {
            const currentState = this._ngRedux.getState();
            const currentRequest = getOfiManageNavListCurrentRequest(currentState);
            OfiNavService.defaultRequestNavList(this._ofiNavService, this._ngRedux, currentRequest);
        }
    }

    updateNavList(navList) {
        const currentState = this._ngRedux.getState();
        const currentRequest = getOfiManageNavListCurrentRequest(currentState);
        const {fundName, navDate} = currentRequest;

        const processNavList = this.processNavList(navList);


        // Fill gaps

        let listToFill = [];
        // was search by nav date. so insert today's price row (price of pending), if today's price is absent.
        if (fundName === '') {
            const navDateNum = mDateHelper.dateStrToUnixTimestamp(navDate, 'YYYY-MM-DD');
            const navDateParsed = mDateHelper.unixTimestampToDateStr(navDateNum, 'DD/MM/YYYY');

            listToFill = this.fillNavGapsIfByDate(processNavList, navDateParsed);

        } else if (navDate === '') {
            // was search by fund name. so fill the price of the date, for all the issued assets. if the price is absent.
            // this.navList = fillNavGaps(navList);
            listToFill = this.fillNavGapsIfByFundName(processNavList, fundName);
        }

        this.navList = [...listToFill, ...processNavList];

        this._changeDetectorRef.markForCheck();
    }

    processNavList(navList) {
        return immutableHelper.map(navList, (item) => {
            const navDate = item.get('navDate', '');
            const navDateNum = mDateHelper.dateStrToUnixTimestamp(navDate, 'YYYY-MM-DD');
            const navDateParsed = mDateHelper.unixTimestampToDateStr(navDateNum, 'DD/MM/YYYY');
            const thisFundName = item.get('fundName', '');
            const fundIsin = _.get(this.assetListObj, [thisFundName, 'isin'], '');

            return {
                fundName: thisFundName,
                fundIsin,
                date: navDateParsed,
                nav: item.get('price', 0),
                status: item.get('status', 0)
            };
        });
    }

    fillNavGapsIfByDate(navList, navDate) {
        return immutableHelper.reduce(this.assetListObj, (result, item) => {
            const assetNameToMatch = item.get('asset');
            const fundIsin = item.get('isin');

            const matchedAsset = immutableHelper.filter(navList, (asset) => {
                const navPriceAssetName = asset.get('fundName', '');
                return navPriceAssetName === assetNameToMatch;
            });

            // if price not found, fill the gap.
            if (matchedAsset.length === 0) {
                result.push({
                    fundName: assetNameToMatch,
                    fundIsin,
                    date: navDate,
                    nav: false,
                    status: 2
                });
            }

            return result;
        }, []);
    }

    fillNavGapsIfByFundName(navList, fundName) {
        const hasToday = immutableHelper.filter(navList, (asset) => {
            const navDate = asset.get('navDate', '');

            const navDateNum = mDateHelper.dateStrToUnixTimestamp(navDate, 'DD/MM/YYYY');
            // if is today
            return (moment().diff(moment(navDateNum), 'day') === 0);
        });

        if (hasToday.length === 0) {
            const todayStr = moment().format('DD/MM/YYYY');
            const fundIsin = _.get(this.assetListObj, [fundName, 'isin'], '');
            return [{
                fundName,
                fundIsin,
                date: todayStr,
                nav: false,
                status: 2
            }];
        }
        return [];
    }

    selectSearchBy(searchBy) {
        this.searchBy = searchBy.id;
        const {fundName, navDate} = this.searchForm.value;
        const fundNameValue = _.get(fundName, '[0].id', '');

        if (this.searchBy === 'byFund') {
            this.handleSearchSubmit({fundName: fundNameValue, navDate: ''});
        } else if (this.searchBy === 'byDate') {
            const navDateNum = mDateHelper.dateStrToUnixTimestamp(navDate, 'DD/MM/YYYY');
            const navDateParse = mDateHelper.unixTimestampToDateStr(navDateNum, 'YYYY-MM-DD');
            this.handleSearchSubmit({fundName: '', navDate: navDateParse});
        } else {
            throw new Error('Unknown nav search by');
        }

        this._changeDetectorRef.markForCheck();
    }

    fundChange($event) {
        const fundName = $event['id'];
        const navDate = '';
        this.handleSearchSubmit({fundName, navDate});
    }

    dateChange($event) {
        const fundName = '';
        const navDateNum = mDateHelper.dateStrToUnixTimestamp($event, 'DD/MM/YYYY');
        const navDate = mDateHelper.unixTimestampToDateStr(navDateNum, 'YYYY-MM-DD');
        this.handleSearchSubmit({fundName, navDate});
    }

    handleSearchSubmit(request: { fundName: string; navDate: string; }) {
        const {fundName, navDate} = request;
        const status = NavStatus.ALL_STATUS;
        const pageNum = 0;
        const pageSize = 1000;

        this._ngRedux.dispatch(ofiSetCurrentManageNavRequest({
            fundName,
            navDate,
            status,
            pageNum,
            pageSize
        }));

        this._ngRedux.dispatch(clearRequestedManageNavList());
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
