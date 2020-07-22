import * as _ from 'lodash';
import * as moment from 'moment';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogService } from '@setl/utils';
import { ToasterService, Toast } from 'angular2-toaster';
import { TransferInOutService } from '../transfer-in-out.service';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { MultilingualService } from '@setl/multilingual';
import {
    OfiManagementCompanyService,
} from '../../ofi-req-services/ofi-product/management-company/management-company.service';

@Component({
    selector: 'app-create-transfer',
    templateUrl: './create-transfer.component.html',
    styleUrls: ['./create-transfer.component.scss'],
})
export class CreateTransferComponent implements OnInit, OnDestroy {
    toastTimer;
    timerToast: Toast;
    toasterConfig: any = {
        type: 'warning',
        title: '',
        timeout: 0,
        tapToDismiss: false,
    };
    disableBtn = false;
    language: string;
    placeTransferFormGroup: FormGroup;
    type = 'operation';
    direction = 'in';
    managementCompanyAccessList = [];
    mananagementCompanyItems = [];
    managementCompanySelected = {};
    shareList = [];
    filteredShareList = [];
    shareSelected = {};
    investorShareList = [];
    investorListItems = [];
    investorSelected = {};
    walletListItems = [];
    walletSelected = {};
    subscriptions: Array<Subscription> = [];
    currencyList: any[];
    accountKeeperSelected: number;
    accountKeeperList: any;

    /** Date */
    datePickerConfig: object;

    /** Observables */
    @select([
        'ofi',
        'ofiProduct',
        'ofiManagementCompany',
        'managementCompanyList',
        'managementCompanyList',
    ]) managementCompanyAccessListOb;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareObs;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs;
    @select(['user', 'siteSettings', 'lang']) languageObs;

    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private router: Router,
                private redux: NgRedux<any>,
                private transferService: TransferInOutService,
                private ofiFundService: OfiFundService,
                private ofiManagementCompanyService: OfiManagementCompanyService,
                private ofiFundShareService: OfiFundShareService,
                public translate: MultilingualService,
                private ofiCurrenciesService: OfiCurrenciesService,
                private logService: LogService,
                private toaster: ToasterService,
                private route: ActivatedRoute,
                @Inject('product-config') productConfig) {
        this.accountKeeperList = productConfig.fundItems.fundAdministratorItems;
        this.ofiCurrenciesService.getCurrencyList();
        this.initDatePickerConfig();
    }

    ngOnInit() {
        this.initForm();

        this.subscriptions.push(this.currenciesObs.subscribe(c => this.getCurrencyList(c)));

        this.subscriptions.push(this.managementCompanyAccessListOb
            .subscribe((d) => {
                this.managementCompanyAccessList = d;
                this.mananagementCompanyItems = Object.keys(this.managementCompanyAccessList).map((key) => {
                    return {
                        id: this.managementCompanyAccessList[key].companyID,
                        text: this.managementCompanyAccessList[key].companyName,
                    };
                });
            }),
        );

        this.subscriptions.push(this.languageObs.subscribe(language => this.language = language));
        this.subscriptions.push(this.fundShareObs.subscribe(shares => this.shareList = shares));
        this.ofiFundShareService.fetchIznesAdminShareList();
        this.ofiManagementCompanyService.getManagementCompanyList();
    }

    /**
     * Get the list of currencies from redux
     *
     * @param {Object[]} data
     * @memberof OfiNavFundView
     */
    getCurrencyList(data) {
        if (data) {
            this.currencyList = data.toJS();
        }
    }

    initDatePickerConfig() {
        this.datePickerConfig = {
            firstDayOfWeek: 'mo',
            format: 'YYYY-MM-DD',
            closeOnSelect: true,
            disableKeypress: true,
            locale: this.language,
        };
    }

    initForm() {
        this.placeTransferFormGroup = this.fb.group({
            amCompany: ['', Validators.required],
            amBic: [{ value: '', disabled: true }],
            amShareFund: ['', Validators.required],
            amShareFundISIN: [{ value: '', disabled: true }],
            investorCompany: ['', Validators.required],
            investorReference: [{ value: '', disabled: true }],
            investorWallet: ['', Validators.required],
            investorWalletReference: [{ value: '', disabled: true }],
            quantity: [0, Validators.required],
            unitPrice: [0, Validators.required],
            amount: [{ value: 0, disabled: true }],
            currency: [{ value: '', disabled: true }],
            theoricalDate: ['', Validators.required],
            initialDate: ['', Validators.required],
            externalReference: [''],
            accountKeeper: ['', Validators.required],
            comment: [''],
            createdBy: [{ value: 'IZNES', disabled: true }],
            dateEntered: [{ value: moment().format('YYYY-MM-DD'), disabled: true }],
        });

        // update amount on quantity input change
        this.placeTransferFormGroup.get('quantity').valueChanges.subscribe((value: number) => {
            this.placeTransferFormGroup.controls['amount'].patchValue(
                value * this.placeTransferFormGroup.controls['unitPrice'].value,
            );
        });

        // update amount on price input change
        this.placeTransferFormGroup.get('unitPrice').valueChanges.subscribe((value: number) => {
            this.placeTransferFormGroup.controls['amount'].patchValue(
                value * this.placeTransferFormGroup.controls['quantity'].value,
            );
        });

        // after change, check if form is valid
        this.placeTransferFormGroup.valueChanges.subscribe(() => {
            this.disableBtn = this.placeTransferFormGroup.valid;
        });
    }

    handleDropdownAccountKeeperSelect(event) {
        this.accountKeeperSelected = event.id;
    }

    handleDropdownAmSelect(event) {
        this.placeTransferFormGroup.controls['amShareFund'].setValue('');
        this.placeTransferFormGroup.controls['amShareFundISIN'].setValue('');
        this.shareSelected = this.walletSelected = this.investorSelected = {};

        for (const key in this.managementCompanyAccessList) {
            if (this.managementCompanyAccessList[key].companyID === event.id) {
                this.managementCompanySelected = this.managementCompanyAccessList[key];
            }
        }

        this.filteredShareList = Object.keys(this.shareList).map((key) => {
            if (this.shareList[key].managementCompanyId === event.id) {
                return {
                    id: key,
                    text: this.shareList[key].fundShareName,
                };
            }
        });
    }

    handleDropdownShareSelect(event) {
        this.walletSelected = this.investorSelected = {};
        this.shareSelected = this.shareList[event.id];
        this.placeTransferFormGroup.controls['currency']
            .setValue(this.currencyList[this.shareSelected['shareClassCurrency']]['text'] || 'EUR');
        this.transferService.fetchInvestorListByShareID(
            this.shareSelected['fundShareID'],
            (res) => {
                if (res[1].Status === 'OK') {
                    const data = res[1].Data;
                    this.investorShareList = data;
                    this.investorListItems = _.uniqBy(
                        Object.keys(this.investorShareList).map((key) => {
                            return {
                                id: key,
                                text:
                                    `${this.investorShareList[key].companyName}`,
                                accountID: this.investorShareList[key].accountID,
                            };
                        }),
                        'accountID');
                }
            },
            (error) => {
                console.log(error);
            });
    }

    handleDropdownInvestorSelect(event) {
        this.walletSelected = {};
        this.investorSelected = this.investorShareList[event.id];
        this.walletListItems = Object.keys(this.investorShareList).map((key) => {
            if (this.investorShareList[key].accountID === this.investorSelected['accountID']) {
                return {
                    id: key,
                    text: this.investorShareList[key].accountLabel,
                    investorSubportfolioID: this.investorShareList[key].investorSubportfolioID,
                };
            }
        });
    }

    handleDropdownInvestorWalletSelect(event) {
        this.walletSelected = this.walletListItems[event.id];
    }

    handleSubmitButtonClick() {
        const request = {
            fundShareID: this.shareSelected['fundShareID'],
            investorWalletID: this.investorSelected['walletID'],
            investorSubportfolioID: this.walletSelected['investorSubportfolioID'],
            transferType: this.type,
            transferDirection: this.direction,
            price: this.placeTransferFormGroup.controls['unitPrice'].value,
            quantity: this.placeTransferFormGroup.controls['quantity'].value,
            theoricalDate: moment(this.placeTransferFormGroup.controls['theoricalDate'].value)
                .format('YYYY-MM-DD HH:mm:ss'),
            initialDate: moment(this.placeTransferFormGroup.controls['initialDate'].value)
                .format('YYYY-MM-DD HH:mm:ss'),
            externalReference: this.placeTransferFormGroup.controls['externalReference'].value,
            accountKeeperID: this.accountKeeperSelected,
            comment: this.placeTransferFormGroup.controls['comment'].value,
        };

        this.transferService.addNewTransfer(request).then((data) => {
            // log to remote server about order is placed
            this.logService.log('info', 'a transfer i/o has been initialized');
            this.toaster.pop('success', 'Your transfer I/O has been succesfully initiated.');
            this.router.navigateByUrl('/transfer-in-out');
        })
        .catch((data) => {
            console.log(data);
        });
    }

    handleCancelButtonClick() {
        this.router.navigateByUrl('/transfer-in-out');
    }

    ngOnDestroy(): void {
        this.cdr.detach();
        this.subscriptions.map(subscription => subscription.unsubscribe());
    }
}
