import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OfiKycService} from '../../ofi-req-services/ofi-kyc/service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
    templateUrl: './place-orders.component.html',
    styleUrls: ['./place-orders.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceOrdersComponent implements OnInit, OnDestroy {
    language: string;
    subscriptions: Array<Subscription> = [];
    placeOrdersFormGroup: FormGroup;
    routeOption: string;
    shareName: string;
    isin: string;
    link: string;
    shareId: number;

    /** Date */
    orderDateConfig: object;
    cutOffDateConfig: object;
    navDateConfig: object;
    settlementDateConfig: object;

    /* Accordion tabs */
    isGenInvestAccordionOpened: boolean;
    isMifidAccordionOpened: boolean;
    isProductInfoAccordionOpened: boolean;
    isDatesInfoAccordionOpened: boolean;
    isOrderInfoAccordionOpened: boolean;

    /* Observables */
    @select(['user', 'siteSettings', 'lang']) languageObs;

    /**
     * Constructor
     *
     * @param fb
     * @param {ChangeDetectorRef} cdr
     * @param router
     * @param kycService
     * @param redux
     * @param route
     */
    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private router: Router,
                private kycService: OfiKycService,
                private redux: NgRedux<any>,
                private route: ActivatedRoute) {

        console.clear();

        // Get the parameter passed to URL
        this.route.params.subscribe((params) => {
            if (params.shareId) {
                this.shareId = Number(params.shareId);
            }
        });

        this.routeOption = 'Subscription';
        this.shareName = 'myShareName';
        this.isin = 'ThisIsAUniqueValue';
        this.link = 'https://google.fr';

        /* Dates config */
        this.orderDateConfig = this.initDatePickerConfig();
        this.cutOffDateConfig = this.initDatePickerConfig();
        this.navDateConfig = this.initDatePickerConfig();
        this.settlementDateConfig = this.initDatePickerConfig();

        /* Accordion flags */
        this.isGenInvestAccordionOpened = true;
        this.isMifidAccordionOpened = true;
        this.isProductInfoAccordionOpened = true;
        this.isDatesInfoAccordionOpened = true;
        this.isOrderInfoAccordionOpened = true;

        /* Init */
        this.initForm();
    }

    ngOnInit(): void {
        this.subscriptions.push(this.languageObs.subscribe(language => this.language = language));
    }

    ngOnDestroy(): void {
        this.cdr.detach();

        this.subscriptions.map(subscription => subscription.unsubscribe());
    }

    initForm() {
        this.placeOrdersFormGroup = this.fb.group({
            /* General investment information */
            assetManagementCompany: [{ value: '', disabled: true }],
            investmentPortfolio: ['', Validators.required],
            entryExitFees: [{ value: 0, disabled: true }],

            /* MiFID */
            oneOffCharges: [{ value: 0, disabled: true }],
            onGoingCharges: [{ value: 0, disabled: true }],
            costsTransactionsInitiated: [{ value: 0, disabled: true }],
            chargesAnciliaryServices: [{ value: 0, disabled: true }],
            incidentalCosts: [{ value: 0, disabled: true }],

            /* Product information */
            isin: [{ value: '', disabled: true }],
            shareName: [{ value: '', disabled: true }],
            assetClass: [{ value: '', disabled: true }],
            srri: [{ value: '', disabled: true }],
            sri: [{ value: '', disabled: true }],
            shareCurrency: [{ value: '', disabled: true }],
            nav: [{ value: '', disabled: true }],
            navDate: [{ value: '', disabled: true }],
            decimalization: [{ value: '', disabled: true }],

            /* Dates information */
            orderDate: [{ value: '', disabled: true }],
            cutOffDate: ['', Validators.required],
            dateInfoNavDate: ['', Validators.required],
            settlementDate: ['', Validators.required],

            /* Order information */
            orderReference: [{ value: '', disabled: true }],
            orderType: [{ value: '', disabled: true }],
            quantity: [0, Validators.required],
            amount: [0, Validators.required],
            grossAmount: [{ value: 0, disabled: true }],
            feeAmount: [{ value: 0, disabled: true }],
            netAmount: [{ value: 0, disabled: true }],
            comment: '',

            /* Other */
            isDisclaimerChecked: [false, Validators.required],
        });
    }

    initDatePickerConfig() {
        return {
            firstDayOfWeek: 'mo',
            format: 'YYYY-MM-DD',
            closeOnSelect: true,
            disableKeypress: true,
            locale: this.language
        };
    }

    resetForm() {
        this.placeOrdersFormGroup.controls['assetManagementCompany'].setValue('');
        this.placeOrdersFormGroup.controls['investmentPortfolio'].setValue('');
        this.placeOrdersFormGroup.controls['entryExitFees'].setValue(0);
        this.placeOrdersFormGroup.controls['oneOffCharges'].setValue(0);
        this.placeOrdersFormGroup.controls['onGoingCharges'].setValue(0);
        this.placeOrdersFormGroup.controls['costsTransactionsInitiated'].setValue(0);
        this.placeOrdersFormGroup.controls['chargesAnciliaryServices'].setValue(0);
        this.placeOrdersFormGroup.controls['incidentalCosts'].setValue(0);
        this.placeOrdersFormGroup.controls['isin'].setValue('');
        this.placeOrdersFormGroup.controls['shareName'].setValue('');
        this.placeOrdersFormGroup.controls['assetClass'].setValue('');
        this.placeOrdersFormGroup.controls['srri'].setValue('');
        this.placeOrdersFormGroup.controls['sri'].setValue('');
        this.placeOrdersFormGroup.controls['shareCurrency'].setValue('');
        this.placeOrdersFormGroup.controls['nav'].setValue('');
        this.placeOrdersFormGroup.controls['navDate'].setValue('');
        this.placeOrdersFormGroup.controls['decimalization'].setValue('');
        this.placeOrdersFormGroup.controls['orderDate'].setValue('');
        this.placeOrdersFormGroup.controls['cutOffDate'].setValue('');
        this.placeOrdersFormGroup.controls['dateInfoNavDate'].setValue('');
        this.placeOrdersFormGroup.controls['settlementDate'].setValue('');
        this.placeOrdersFormGroup.controls['orderReference'].setValue('');
        this.placeOrdersFormGroup.controls['orderType'].setValue('');
        this.placeOrdersFormGroup.controls['quantity'].setValue(0);
        this.placeOrdersFormGroup.controls['amount'].setValue(0);
        this.placeOrdersFormGroup.controls['grossAmount'].setValue(0);
        this.placeOrdersFormGroup.controls['feeAmount'].setValue(0);
        this.placeOrdersFormGroup.controls['netAmount'].setValue(0);
        this.placeOrdersFormGroup.controls['comment'].setValue('');
        this.placeOrdersFormGroup.controls['isDisclaimerChecked'].setValue(false);
        this.placeOrdersFormGroup.reset();
    }

    handleCancelButtonClick() {
        // TODO: add the route to redirect to
        this.router.navigate([]);
    }

    handleSubmitButtonClick() {
        console.log('on submit button click');
    }
}
