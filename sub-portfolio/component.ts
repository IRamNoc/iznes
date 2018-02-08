// Vendor
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {fromJS} from 'immutable';
import {Subscription} from 'rxjs/Subscription';
import {select, NgRedux} from '@angular-redux/store';
import * as _ from 'lodash';

// Internal
import {
    MyWalletsService,
    MemberService,
    WalletnodeTxService,
    WalletNodeRequestService,
    InitialisationService
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
import {SagaHelper, immutableHelper} from '@setl/utils';

@Component({
    selector: 'app-manage-sub-portfolio',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ManageSubPortfolioComponent implements OnInit, OnDestroy {
    addressObject: any;
    addressList: Array<any>;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    tabDetail: any;

    connectedWalletId: number;
    requestedWalletAddress: boolean;

    // List of Redux observable.
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private _myWalletService: MyWalletsService,
                private _memberService: MemberService,
                private _walletnodeTxService: WalletnodeTxService,
                private _walletNodeRequestService: WalletNodeRequestService,
                private changeDetectorRef: ChangeDetectorRef) {

        /* tab meta */
        this.tabDetail = {
            title: {
                text: 'Manage sub-portfolio',
                icon: '<i class="fa fa-id-badge">'
            }
        };

        this.connectedWalletId = 0;
        this.requestedWalletAddress = false;

        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));
        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => this.updateAddressList(addressList)));
        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe(requested => {
            this.requestAddressList(requested);
        }));
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested)));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    updateAddressList(addressList) {
        console.log('addressList: ', addressList);
        this.addressObject = addressList;
        // const

        this.addressList = immutableHelper.reduce(addressList, (result, item) => {

            const addressItem = {
                address: item.get('addr', ''),
                label: item.get('label', ''),
                iban: item.get('iban', ''),
                editing: false
            };

            if (addressItem.iban !== '' && addressItem.address !== '') {
                result.push(addressItem);
            }


            return result;
        }, []);

        this.changeDetectorRef.markForCheck();
    }

    requestAddressList(requestedState) {
        this.requestedWalletAddress = requestedState;
        console.log('requested wallet address', this.requestedWalletAddress);

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            // Request the list.
            InitialisationService.requestWalletAddresses(this.ngRedux, this._walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requestedState) {

        console.log('checking requested', this.requestedWalletAddress);
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {

            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this._myWalletService, this.connectedWalletId);
        }
    }

    ngOnInit() {
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
        this.addressList = immutableHelper.map(this.addressList, (addressEntry) => {
            if (addressEntry.get('address', '') === address) {
                return addressEntry.set('editing', true);
            }
            return addressEntry;

        });
    }

    /**
     * Handle cancel button is clicked.
     * @param address
     */
    handleCancelEdit(address): void {
        this.addressList = immutableHelper.map(this.addressList, (addressEntry) => {
            if (addressEntry.get('address', '') === address) {
                return addressEntry.set('editing', false);
            }
            return addressEntry;

        });
    }

    handleUpdateLabel(value, address, iban) {

        const asyncTaskPipe = this._myWalletService.updateWalletLabel({
            walletId: this.connectedWalletId,
            option: address,
            label: value,
            iban
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe,
            (labelResponse) => {
                this.ngRedux.dispatch(clearRequestedWalletLabel());

                const message = _.get(labelResponse, '[1].Data[0].Message', 'All OK');
                this.handleLabelResponse(message);
            }, (labelResponse) => {
                this.showErrorResponse(labelResponse);
            }));

    }

    handleNewSubPortfolio(name, iban) {
        /* Check if we have a name. */
        if (!name || name === '') {
            this.showErrorMessage('Please give your sub portfolio a name');
            return;
        }

        if (!iban || iban === '') {
            this.showErrorMessage('Please give your sub portfolio an IBAN');
            return;
        }

        // create address
        const asynTaskPipe = this._walletnodeTxService.newAddress({walletId: this.connectedWalletId});

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(asynTaskPipe,
            (data) => {

                const address = _.get(data, [1, 'data', 'address'], '');
                // create address label
                const labelAsynTaskPipe = this._myWalletService.newWalletLabel({
                    walletId: this.connectedWalletId,
                    option: address,
                    label: name,
                    iban
                });

                this.ngRedux.dispatch(SagaHelper.runAsyncCallback(labelAsynTaskPipe,
                    (labelResponse) => {
                        this.ngRedux.dispatch(clearRequestedWalletLabel());
                        const message = _.get(labelResponse, '[1].Data[0].Message', 'All OK');
                        this.handleLabelResponse(message);

                    },
                    (labelResponse) => {
                        this.showErrorMessage('<span mltag="txt_address_created_sub_fail">' +
                            'Portfolio address created in the blockchain, but fail to create sub-portfolio' +
                            '</span>');
                    }));
            }, (data) => {
                this.showErrorResponse(data);
            }));

    }

    handleLabelResponse(message) {
        switch (message) {
            case 'All OK':
                this.showSuccessResponse('<span mltag="txt_portfolio_created">Portfolio created</span>');
                break;

            case 'Duplicate Label':
                this.showWarningResponse('<span mltag="txt_subportfolioname_is_exist">Sub-portfolio name has already exist</span>');
                break;

            case 'Duplicate IBAN':
                this.showWarningResponse('<span mltag="txt_iban_is_exist">IBAN has already exist</span>');
                break;

            case 'Duplicate Label and IBAN':
                this.showWarningResponse('<span mltag="txt_subportfolioname_and_iban_is_exist">Sub-portfolio and IBAN has already exist</span>');
                break;

            default:
                this.showSuccessResponse('<span mltag="txt_portfolio_created">Portfolio created</span>');
                break;
        }
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

    showErrorMessage(message) {

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

    showWarningResponse(message) {

        this.alertsService.create('warning', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-warning">${message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

}
