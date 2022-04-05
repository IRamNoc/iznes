// Vendor
import { Component, OnDestroy, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

// Internal
import { DELETE_WALLET_LABEL } from '@setl/core-store';
import { DELETE_SUB_PORTFOLIO_BANKING_DETAIL } from '@ofi/ofi-main/ofi-store';
import { OfiSubPortfolioService } from './service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { SagaHelper, ConfirmationService } from '@setl/utils';
import { CustomValidators } from '@setl/utils/helper';
import { OfiSubPortfolioReqService } from '@ofi/ofi-main/ofi-req-services/ofi-sub-portfolio/service';
import { MultilingualService } from '@setl/multilingual';
import { MyUserService } from '@setl/core-req-services/my-user/my-user.service';
import { fundItems } from '@ofi/ofi-main/ofi-product/productConfig';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { FileDropComponent } from '@setl/core-filedrop';

@Component({
    selector: 'ofi-sub-portfolio',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})

export class OfiSubPortfolioComponent implements OnDestroy {
    private connectedWalletId: number = 0;
    public addressList: Array<any>;
    public addressListDraft: Array<any>;
    public tabDetail: Array<object>;
    public oldsubPortfolioData: Array<object>;
    public showFormModal: boolean = false;
    public showAddress: boolean = false;
    public currentAddress: string;
    public editForm: boolean = false;
    public editDraft: boolean = false;
    public countries: any[] = this.translate.translate(fundItems.domicileItems);
    currenciesItems = [];
    custodianPaymentItems = [
        { id: 0, text: 'None / Aucun' },
        { id: 1, text: 'SGSS' },
        { id: 3, text: 'BPSS' },
        { id: 5, text: 'CACEIS Bank France' },
        { id: 11, text: 'OFI AM' }
    ];
    custodianPositionItems = [
        { id: 0, text: 'None / Aucun' },
        { id: 1, text: 'SGSS' },
        { id: 5, text: 'CACEIS Bank France' },
        { id: 10, text: 'Generali' },
        { id: 11, text: 'OFI AM' }
    ];
    custodianTransactionNoticesItems = [
        { id: 0, text: 'None / Aucun' },
        { id: 5, text: 'CACEIS' },
        { id: 10, text: 'Generali' }
    ];
    file = {
        control: null,
        fileData: {
            fileID: null,
            hash: null,
            name: null,
        },
    };
    @ViewChild('fileDrop') fileDropRef: FileDropComponent;

    unSubscribe: Subject<any> = new Subject();

    @select(['user', 'siteSettings', 'language']) languageOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['user', 'authentication', 'allowCBDC']) allowCBDC$;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currencyList$;

    constructor(
        private ngRedux: NgRedux<any>,
        private alertsService: AlertsService,
        private ofiSubPortfolioReqService: OfiSubPortfolioReqService,
        private ofiSubPortfolioService: OfiSubPortfolioService,
        private confirmationService: ConfirmationService,
        private myUserService: MyUserService,
        public translate: MultilingualService,
        private ofiCurrenciesService: OfiCurrenciesService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        this.ofiCurrenciesService.getCurrencyList();
        this.tabDetail = [{
            title: {
                text: this.translate.translate('Manage Sub-portfolio'),
                icon: 'fa-id-badge',
            },
        }];
        this.initSubscriptions();
        this.setupFormGroup();
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

    initSubscriptions() {
        this.ofiSubPortfolioService.getSubPortfolioData()
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((data) => {
                this.addressList = data;
            });

        this.ofiSubPortfolioService.updateSubPortfolioObservable();

        this.connectedWalletOb
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((connected: number) => {
                this.connectedWalletId = connected;
            });

        this.languageOb
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => {
                this.tabDetail[0]['title'].text = this.translate.translate('Manage Sub-portfolio');
                this.countries = this.translate.translate(fundItems.domicileItems);
            });

        this.currencyList$
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((d) => {
                const data = d.toJS();

                if (!data.length) {
                    return [];
                }

                this.currenciesItems = data;
            });

        this.addressListDraft = [];
        this.ofiSubPortfolioReqService
        .getSubPortfolioBankingDetailsDraft(this.connectedWalletId)
        .then(result => {
            console.log('result', result);
            _.each(result[1].Data, data => this.addressListDraft.push(data));
        });
        console.log(`this.connectedWalletId`, this.connectedWalletId);
        console.log(`this.addressListDraft`, this.addressListDraft);

    }

    setupFormGroup() {
        const bankIdentificationStatement = new FormControl('', [Validators.required]);
        this.tabDetail[0]['formControl'] = new FormGroup(
            {
                hashIdentifierCode: new FormControl({ value: '', disabled: true }),
                investorReference: new FormControl('', [Validators.maxLength(255)]),
                accountLabel: new FormControl('', [Validators.required, Validators.maxLength(35), CustomValidators.swiftNameAddressValidator]),
                accountCurrency: new FormControl(0),
                custodianPayment: new FormControl(0),
                custodianPosition: new FormControl(0),
                custodianTransactionNotices: new FormControl(0),
                label: new FormControl('', [Validators.required, this.duplicatedLabel.bind(this), Validators.maxLength(200)]),
                establishmentName: new FormControl('', [Validators.required, Validators.maxLength(45)]),
                addressLine1: new FormControl('', [Validators.required, Validators.maxLength(255)]),
                addressLine2: new FormControl('', [Validators.maxLength(255)]),
                zipCode: new FormControl('', [Validators.required, Validators.maxLength(10)]),
                city: new FormControl('', [Validators.required, Validators.maxLength(45)]),
                country: new FormControl('', [Validators.required]),
                accountOwner: new FormControl('', [Validators.required, Validators.maxLength(255)]),
                ownerAddressLine1: new FormControl('', [Validators.required, CustomValidators.swiftNameAddressValidator]),
                ownerAddressLine2: new FormControl('', [CustomValidators.swiftNameAddressValidator]),
                ownerZipCode: new FormControl('', [Validators.required, Validators.maxLength(10), CustomValidators.swiftNameAddressValidator]),
                ownerCity: new FormControl('', [Validators.required, Validators.maxLength(45), CustomValidators.swiftNameAddressValidator]),
                ownerCountry: new FormControl('', [Validators.required]),
                iban: new FormControl('', [Validators.required, CustomValidators.ibanValidator]),
                bic: new FormControl('', [Validators.required, CustomValidators.bicValidator]),
                emailtransactionnotice: new FormControl(''),
                emailcertificationbookentry: new FormControl(''),
                securityAccount: new FormControl('', [Validators.required, Validators.maxLength(16)]),
                cashAccount: new FormControl('', [Validators.maxLength(16)]),
                useCBDC: new FormControl(''),
                notes: new FormControl('', [Validators.maxLength(500)]),
                bicInvestorCode: new FormControl(''),
                bankIdentificationStatement,
            },
        );
        this.file.control = bankIdentificationStatement;
    }

    onDropFile(event) {
        this.ofiSubPortfolioService.uploadFile(event, this.file, this.changeDetectorRef);
    }

    handleEdit(address): void {
        this.oldsubPortfolioData = [];
        this.setupFormGroup();
        const subPortfolio = this.addressList.find((subPortfolio) => {
            return subPortfolio.addr === address;
        });
        this.oldsubPortfolioData = subPortfolio;

        Object.keys(subPortfolio).forEach((item) => {
            if (this.tabDetail[0]['formControl'].controls[item]) {
                this.tabDetail[0]['formControl'].controls[item].patchValue(subPortfolio[item]);
            }
        });
        this.tabDetail[0]['formControl'].controls.hashIdentifierCode.patchValue(address);
        this.tabDetail[0]['formControl'].controls.emailtransactionnotice.patchValue(subPortfolio.emailtransactnotice);
        this.tabDetail[0]['formControl'].controls.emailcertificationbookentry.patchValue(subPortfolio.emailcertificationbookentry);
        this.tabDetail[0]['formControl'].controls.accountCurrency.patchValue([_.find(this.currenciesItems, { id: subPortfolio.accountCurrency })]);
        this.tabDetail[0]['formControl'].controls.custodianPayment.patchValue([_.find(this.custodianPaymentItems, { id: subPortfolio.custodianPaymentID })]);
        this.tabDetail[0]['formControl'].controls.custodianPosition.patchValue([_.find(this.custodianPositionItems, { id: subPortfolio.custodianPositionID })]);
        this.tabDetail[0]['formControl'].controls.custodianTransactionNotices.patchValue([_.find(this.custodianTransactionNoticesItems, { id: subPortfolio.custodianTransactionNoticesID })]);
        this.file.fileData = subPortfolio.bankIdentificationStatement;
        this.file.control.patchValue(subPortfolio.bankIdentificationStatement.fileID);

        this.currentAddress = address;
        this.editForm = true;
        this.editDraft = true;
        this.showFormModal = true;
    }

    /**
     * Toggle the Form Modal visibility and reset formGroup
     * @return void
     */
    toggleFormModal() {
        const fileDrop = this.fileDropRef.dropHandlerRef;
        fileDrop.encodedFiles.forEach((item, i) => fileDrop.clearFiles(i));
        this.file = {
            control: null,
            fileData: {
                fileID: null,
                hash: null,
                name: null,
            },
        };
        this.setupFormGroup();
        this.editForm = false;
        this.editDraft = false;
        this.showFormModal = !this.showFormModal;
    }

    getSubPortfolioFormValue() {
        const values = this.tabDetail[0]['formControl'].value;
        return this.ofiSubPortfolioService.getSubPortfolioFormValue(values, this.file.fileData);
    }

    /**
     * Save a new Sub-portfolio
     * @return void
     */
    saveSubPortfolio() {
        const payload = this.getSubPortfolioFormValue();
        const asyncTaskPipe = this.ofiSubPortfolioReqService.saveNewSubPortfolio(payload);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (labelResponse) => {
                const message = _.get(labelResponse, '[1].Data[0].Message', 'OK');
                this.ofiSubPortfolioService.resetRequestedFlags();
                if (message === 'OK') {
                    this.handleLabelResponse(message, 'created');
                    this.toggleFormModal();

                    // update the default home page to '/home'
                    if (this.isFirstAddress()) {
                        this.myUserService.updateHomePage('/home');
                    }
                }
            },
            (response) => {
                const message = _.get(response, '[1].Data[0].Message', 'Fail');
                if (message === 'Duplicate Label') {
                    this.handleLabelResponse(message, 'created');
                } else {
                    this.alertsService.generate('error', this.translate.translate('Error creating sub-portfolio'));
                }
            }));
    }

      /**
     * Save a new Sub-portfolio
     * @return void
     */
       saveSubPortfolioDraft() {
        const payload = this.getSubPortfolioFormValue();
        const asyncTaskPipe = this.ofiSubPortfolioReqService.insertSubPortfolioDraft(payload);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (labelResponse) => {
                const message = _.get(labelResponse, '[1].Data[0].Message', 'OK');
                this.ofiSubPortfolioService.resetRequestedFlags();
                if (message === 'OK') {
                    this.handleLabelResponse(message, 'created');
                    this.toggleFormModal();

                    // update the default home page to '/home'
                    if (this.isFirstAddress()) {
                        this.myUserService.updateHomePage('/home');
                    }
                }
            },
            (response) => {
                const message = _.get(response, '[1].Data[0].Message', 'Fail');
                if (message === 'Duplicate Label') {
                    this.handleLabelResponse(message, 'created');
                } else {
                    this.alertsService.generate('error', this.translate.translate('Error creating draft'));
                }
            }));
    }

    /**
     * Update an existing Sub-portfolio
     * @return void
     */
    updateSubPortfolio() {
        const payload = {
            ...this.getSubPortfolioFormValue(),
            option: this.currentAddress,
            oldSubportfolio: this.oldsubPortfolioData,
        };

        const asyncTaskPipe = this.ofiSubPortfolioReqService.updateSubPortfolio(payload);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (labelResponse) => {
                const message = _.get(labelResponse, '[1].Data[0].Message', 'OK');
                this.ofiSubPortfolioService.resetRequestedFlags();
                if (message === 'OK') {
                    this.handleLabelResponse(message, 'updated');
                    this.toggleFormModal();
                }
            },
            () => {
                this.alertsService.generate('error', this.translate.translate('Error updating sub-portfolio'));
            }));
    }

    /**
     * Update an existing Sub-portfolio
     * @return void
     */
     updateSubPortfolioDraft() {
        const payload = {
            ...this.getSubPortfolioFormValue(),
            option: this.currentAddress,
            oldSubportfolio: this.oldsubPortfolioData,
        };

        const asyncTaskPipe = this.ofiSubPortfolioReqService.updateSubPortfolioDraft(payload);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (labelResponse) => {
                const message = _.get(labelResponse, '[1].Data[0].Message', 'OK');
                this.ofiSubPortfolioService.resetRequestedFlags();
                if (message === 'OK') {
                    this.handleLabelResponse(message, 'updated');
                    this.toggleFormModal();
                }
            },
            () => {
                this.alertsService.generate('error', this.translate.translate('Error updating draft'));
            }));
    }

    /**
     * Handles deleting an existing Sub-portfolio
     * @param address
     * @return void
     */
    handleDelete(address) {
        const index = this.addressList.findIndex(x => x.addr === address);
        const addressLabel = this.addressList[index].label;
        if (index > -1) {
            this.confirmationService.create(
                this.translate.translate(
                    'Delete @label@ - @iban@',
                    { label: this.addressList[index].label, iban: this.addressList[index].iban },
                ),
                this.translate.translate('Are you sure you want to delete this sub-portfolio? You will not be able to create another sub-portfolio with this name.'),
                {
                    confirmText: this.translate.translate('Delete'),
                    declineText: this.translate.translate('Cancel'),
                    btnClass: 'error',
                },
            ).subscribe((ans) => {
                if (ans.resolved) {
                    const asyncTaskPipe = this.ofiSubPortfolioReqService.deleteSubPortfolio({
                        walletId: this.connectedWalletId,
                        address,
                    });

                    this.ngRedux.dispatch(SagaHelper.runAsync(
                        [DELETE_WALLET_LABEL, DELETE_SUB_PORTFOLIO_BANKING_DETAIL],
                        [],
                        asyncTaskPipe,
                        {},
                        (response) => {
                            if (String(_.get(response, '[1].Data.balance', '0')) === '0') {
                                this.ofiSubPortfolioService.resetRequestedFlags();
                                this.alertsService.generate('success', this.translate.translate(
                                    'Your sub-portfolio @addressLabel@ has been successfully deleted. This may take a moment to update.',
                                    { addressLabel }));
                            } else {
                                this.alertsService.generate('warning', this.translate.translate(
                                    'You are not able to delete this sub-portfolio because it is not empty. If you want to delete it, you need to redeem all of your shares from this sub-portfolio'));
                            }
                        },
                        (labelResponse) => {
                            this.alertsService.generate('error', this.translate.translate('Error deleting sub-portfolio'));
                        }));
                }
            });
        }
    }

    /**
     * Handles displaying alerts based on the request response
     * @param message
     * @param type
     * @return void
     */
    handleLabelResponse(message, type) {
        switch (message) {
            case 'Duplicate Label':
                this.alertsService.generate('error', this.translate.translate('Sub-portfolio name already exists'));
                break;

            default:
                this.alertsService.generate('success', this.translate.translate(
                    'Your sub-portfolio @subPortfolioName@ has been successfully @actionType@. This may take a moment to update.', {
                    subPortfolioName: this.tabDetail[0]['formControl'].value.label,
                    actionType: type,
                }));
                break;
        }
    }

    /**
     * When we created a sub-portfolio, we check if the address we created was the first sub-portfolio, we do that by checking
     * if there was no sub-portfolio in the cache.
     * @return {boolean}
     */
    isFirstAddress(): boolean {
        return this.addressList.length === 0;
    }

    /**
     * Get error message of a form control
     * @param {string} control
     * @return {any}
     */
    getFormError(control: string) {
        try {
            const formControl = this.tabDetail[0]['formControl'].controls[control];

            if (formControl.touched && !formControl.valid) {
                switch (Object.keys(formControl.errors)[0]) {
                    case 'required':
                        return this.translate.translate('Field is required');
                    case 'iban':
                        return this.translate.translate('IBAN must be 14 to 34 characters long with 2 letters at the beginning');
                    case 'bic':
                        return this.translate.translate('BIC must be 11 characters, ISO 9362, if 9 to 11 are empty then put "XXX"');
                    case 'duplicatedLabel':
                        return this.translate.translate('This sub-portfolio name is already used. Please choose another one');
                    case 'swiftNameAddress':
                        return this.translate.translate('Should be 35 characters max. and no special characters');
                    default:
                        return this.translate.translate('Invalid field');
                }
            }
            return false;

        } catch (e) {
            return false;
        }
    }

    /**
     * Form validator to check if wallet label is duplicated
     * @param {object} control
     * @return {any}
     */
    duplicatedLabel(control: FormControl) {
        try {
            for (const addr of this.addressList) {
                if (addr.label === control.value) {
                    if (!this.editForm) return { duplicatedLabel: true };
                    if (!this.editDraft) return { duplicatedLabel: false };
                    if (this.currentAddress !== addr.addr) return { duplicatedLabel: true };
                }
            }
        } catch (e) {
            return null;
        }
        return null;
    }
}
