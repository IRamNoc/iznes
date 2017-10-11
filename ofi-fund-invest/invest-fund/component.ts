// Vendor
import {
    Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, EventEmitter,
    Output, OnDestroy, ViewChild, ElementRef
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {fromJS} from 'immutable';
import _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {select} from '@angular-redux/store';
import {NgRedux} from '@angular-redux/store';

// Internal
import {immutableHelper, MoneyValuePipe} from '@setl/utils';
import {CommonService} from '../common-service/service';
import {InvestFundFormService} from './service';
import {
    InitialisationService,
    MyWalletsService,
    WalletNodeRequestService
} from '@setl/core-req-services';
import {setRequestedWalletAddresses} from '@setl/core-store';

@Component({
    selector: 'app-invest-fund',
    templateUrl: 'component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        InvestFundFormService
    ]
})

export class InvestFundComponent implements OnInit, OnDestroy {
    @Input() shareId: number;
    @Input() type: string;

    @Output() close: EventEmitter<any> = new EventEmitter();

    // List of observable subscription.
    subscriptionsArray: Array<Subscription> = [];

    connectedWalletId: number;
    requestedWalletAddress: boolean;

    // List of redux observable.
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) shareDataOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    // 0: quantity, 1: amount
    _actionBy: number;

    // form config
    formConfig: any;

    // Date picker configuration
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'DD-MM-YYYY',
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',
    };

    // subscription form meta data.
    metaData: any;

    // Form
    form: FormGroup;
    quantity: FormControl;
    grossAmount: FormControl;
    address: FormControl;

    addressSelected: any;

    // store subscription of quantity and grossAmount.
    // they should never subscribe at the same time, so it is ok to just use one variable.
    inputSubscription: Subscription;

    addressList: Array<any>;


    set actionBy(value) {
        this._actionBy = value;
    }

    get actionBy() {
        return this._actionBy;
    }

    get fee() {
        return (Number(this._moneyValuePipe.parse(this.grossAmount.value)) * this.metaData.feePercent / 100) + 1;
    }

    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _commonService: CommonService,
                private _moneyValuePipe: MoneyValuePipe,
                private _investFundFormService: InvestFundFormService,
                private _myWalletService: MyWalletsService,
                private _walletNodeRequestService: WalletNodeRequestService,
                private _ngRedux: NgRedux<any>) {
        this._actionBy = 0;

    }

    ngOnDestroy() {

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.quantity = new FormControl(0, [Validators.required, numberValidator]);
        this.grossAmount = new FormControl(0, [Validators.required, numberValidator]);
        this.address = new FormControl('', [Validators.required]);

        // Subscription form
        this.form = new FormGroup({
            quantity: this.quantity,
            grossAmount: this.grossAmount,
            comment: new FormControl('', Validators.maxLength(100)),
            address: this.address
        });

        this.formConfig = {
            subscribe: {
                nonAcquiredFeeKey: 'entryFee',
                acquiredFeeKey: 'sAcquiredFee',
                cutoffDateKey: 'sCutoffDate',
                valuationDateKey: 'sValuationDate',
                settlementDateKey: 'sSettlementDate',
                allowTypeKey: 'sAllowType',
                actionLabel: 'subscribe',
                feeLabel: 'Entry',
            },
            redeem: {
                nonAcquiredFeeKey: 'exitFee',
                acquiredFeeKey: 'rAcquiredFee',
                cutoffDateKey: 'rCutoffDate',
                valuationDateKey: 'rValuationDate',
                settlementDateKey: 'rSettlementDate',
                allowTypeKey: 'rAllowType',
                actionLabel: 'redeem',
                feeLabel: 'Exit',

            }
        }[this.type];

        // List of observable subscription.
        this.subscriptionsArray.push(this.shareDataOb.subscribe((shareData) => {
            this.updateShareMetaData(shareData);
        }));
        this.subscriptionsArray.push(this.connectedWalletOb.subscribe(connected => {
            this.connectedWalletId = connected;
        }));
        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => this.updateAddressList(addressList)));
        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe(requested => {
            this.requestAddressList(requested);
        }));
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe(requested => this.requestWalletLabel(requested)));

    }

    updateShareMetaData(shareData) {
        const filteredShareData = immutableHelper.filter(shareData, (data, id) => {
            return id === String(this.shareId);
        });

        const thisShareData = immutableHelper.get(filteredShareData, String(this.shareId), {});

        const shareCharacteristic = this._commonService.getFundCharacteristic(thisShareData);
        console.log(shareCharacteristic);

        const nonAcquiredFee = immutableHelper.get(shareCharacteristic, this.formConfig.nonAcquiredFeeKey, 0);
        const acquiredFee = immutableHelper.get(shareCharacteristic, this.formConfig.acquiredFeeKey, 0);
        const feePercent = nonAcquiredFee + acquiredFee;

        this.metaData = {
            registrar: immutableHelper.get(thisShareData, 'managementCompany', ''),
            shareName: immutableHelper.get(thisShareData, 'shareName', ''),
            isin: immutableHelper.get(thisShareData, ['metaData', 'isin'], ''),
            currency: immutableHelper.get(thisShareData, ['metaData', 'portfolio_currency_select'], ''),
            cutoff: immutableHelper.get(shareCharacteristic, [this.formConfig.cutoffDateKey], 0),
            valuation: immutableHelper.get(shareCharacteristic, [this.formConfig.valuationDateKey], 0),
            settlement: immutableHelper.get(shareCharacteristic, [this.formConfig.settlementDateKey], 0),
            allowType: immutableHelper.get(shareCharacteristic, [this.formConfig.allowTypeKey], 0),
            knownNav: immutableHelper.get(shareCharacteristic, ['knownNav'], false),
            nav: immutableHelper.get(shareCharacteristic, 'nav', 0),
            nonAcquiredFee,
            acquiredFee,
            feePercent,
            platformFee: immutableHelper.get(shareCharacteristic, 'platformFee', 0),
            decimalisation: immutableHelper.get(shareCharacteristic, 'decimalisation', 2)
        };
    }

    updateAddressList(addressList) {

        this.addressList = immutableHelper.reduce(addressList, (result, item) => {

            const addr = item.get('addr', false);
            const label = item.get('label', false);

            if (addr && label) {
                const addressItem = {
                    id: item.get('addr', ''),
                    text: item.get('label', '')
                };

                result.push(addressItem);
            }

            return result;
        }, []);

        // Set default or selected address.
        const hasSelectedAddressInList = immutableHelper.filter(this.addressList, (thisItem) => {
            return thisItem.get('id') === this.addressSelected && this.addressSelected.id;
        });


        if (this.addressList.length > 0) {
            if (!this.addressSelected || hasSelectedAddressInList.length === 0) {
                console.log('selecting', this.addressList[0]);
                this.address.setValue([this.addressList[0]], {
                    onlySelf: true,
                    emitEvent: true,
                    emitModelToViewChange: true,
                    emitViewToModelChange: true
                });
            } else {
                this.address.setValue([this.addressSelected], {
                    onlySelf: true,
                    emitEvent: true,
                    emitModelToViewChange: true,
                    emitViewToModelChange: true
                });
            }
        }

        this._changeDetectorRef.markForCheck();

    }

    requestAddressList(requestedState) {
        this.requestedWalletAddress = requestedState;
        console.log('requested wallet address', this.requestedWalletAddress);

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this._ngRedux.dispatch(setRequestedWalletAddresses());

            // Request the list.
            InitialisationService.requestWalletAddresses(this._ngRedux, this._walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requestedState) {

        console.log('checking requested', this.requestedWalletAddress);
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {

            MyWalletsService.defaultRequestWalletLabel(this._ngRedux, this._myWalletService, this.connectedWalletId);
        }
    }

    handleSelectedAddress(value) {
        this.addressSelected = value;
    }

    handleClose() {
        this.close.emit();
    }

    handleSubmit() {
        console.log(this.form);

        if (this.form.valid) {
            console.log(this.form.value);

            // Add actionBy
            const formValue = Object.assign({}, this.form.value, {byType: this.actionBy});
            this._investFundFormService.handleForm(formValue, this.metaData, this.type);
        }
    }

    subscribeForChange(type: string): void {
        // define which one trigger which, depend on type.
        const triggering: FormControl = {
            'quantity': this.quantity,
            'grossAmount': this.grossAmount,
        }[type];

        const beTriggered: FormControl = {
            'quantity': this.grossAmount,
            'grossAmount': this.quantity
        }[type];

        const callBack = {
            'quantity': (value) => {
                const newValue = this._moneyValuePipe.parse(value, this.metaData.decimalisation);
                beTriggered.setValue(this._moneyValuePipe.transform(newValue * this.metaData.nav));
            },
            'grossAmount': (value) => {
                const newValue = this._moneyValuePipe.parse(value);
                beTriggered.setValue(this._moneyValuePipe.transform(newValue / this.metaData.nav, this.metaData.decimalisation));
            }
        }[type];

        this.inputSubscription = triggering.valueChanges.distinctUntilChanged().subscribe(callBack);
    }

    unSubscribeForChange(): void {
        if (this.inputSubscription) {
            this.inputSubscription.unsubscribe();
        }
    }
}

/**
 * Number validator:
 *
 * - Takes a `Control` as it's input and
 * - Returns a `StringMap<string, boolean>` where the key is "error code" and
 *   the value is `true` if it fails
 */
function numberValidator(control: FormControl): { [s: string]: boolean } {
    // todo
    // check if number is none zero as well
    const testString = control.value.toString();
    if (!/^\d+$|^\d+[\d,. ]+\d$/.test(testString)) {
        return {invalidNumber: true};
    }
}
