// Vendor
import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

// Internal
import { MyWalletsService, WalletNodeRequestService } from '@setl/core-req-services';
import { clearRequestedWalletLabel, DELETE_WALLET_LABEL } from '@setl/core-store';
import { DELETE_SUB_PORTFOLIO_BANKING_DETAIL } from '@ofi/ofi-main/ofi-store';
import { OfiSubPortfolioService } from './service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { SagaHelper, LogService, ConfirmationService } from '@setl/utils';
import { CustomValidators } from '@setl/utils/helper';
import { OfiSubPortfolioReqService } from '@ofi/ofi-main/ofi-req-services/ofi-sub-portfolio/service';
import { MultilingualService } from '@setl/multilingual';
import { UserTourService } from '@setl/core-req-services/usertour/service';
import { MyUserService } from '@setl/core-req-services/my-user/my-user.service';
import { fundItems } from '@ofi/ofi-main/ofi-product/productConfig';
import { userToursEnums } from '@setl/core-req-services/usertour/config';

@Component({
    selector: 'ofi-sub-portfolio',
    styleUrls: ['./component.scss'],
    providers: [OfiSubPortfolioService],
    templateUrl: './component.html',
})

export class OfiSubPortfolioComponent implements OnDestroy {
    private subscriptionsArray: Array<Subscription> = [];
    private connectedWalletId: number = 0;
    public addressList: Array<any>;
    public tabDetail: Array<object>;
    public showFormModal: boolean = false;
    public showAddress: boolean = false;
    public currentAddress: string;
    public editForm: boolean = false;
    public countries: any[] = this.translate.translate(fundItems.domicileItems);

    public showUsertour: boolean = false;
    private tourObject = [];

    @select(['user', 'siteSettings', 'language']) languageOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['user', 'myDetail', 'defaultHomePage']) defaultHomePageOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private myWalletService: MyWalletsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private ofiSubPortfolioReqService: OfiSubPortfolioReqService,
                private ofiSubPortfolioService: OfiSubPortfolioService,
                private confirmationService: ConfirmationService,
                private toaster: ToasterService,
                private logService: LogService,
                private userTourService: UserTourService,
                private myUserService: MyUserService,
                public translate: MultilingualService,
    ) {
        this.tabDetail = [{
            title: {
                text: this.translate.translate('Manage Sub-portfolio'),
                icon: 'fa-id-badge',
            },
        }];
        this.initSubscriptions();
        this.setupFormGroup();
    }

    /**
     * Initialise Subscriptions
     * @return void
     */
    initSubscriptions() {
        this.subscriptionsArray.push(this.ofiSubPortfolioService.getSubPortfolioData().subscribe((data) => {
            this.addressList = data;
        }));

        this.ofiSubPortfolioService.updateSubPortfolioObservable();

        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connected: number) => {
            this.connectedWalletId = connected;
        }));

        this.subscriptionsArray.push(this.languageOb.subscribe(() => {
            this.tabDetail[0]['title'].text = this.translate.translate('Manage Sub-portfolio');
            this.countries = this.translate.translate(fundItems.domicileItems);
        }));

        this.subscriptionsArray.push(this.defaultHomePageOb.subscribe((defaultHomePage) => {
            if (defaultHomePage === '/user-administration/subportfolio') {
                // launch the tour!
            }
        }));
    }

    /**
     * Setup FormGroup
     * @return void
     */
    setupFormGroup() {
        this.tabDetail[0]['formControl'] = new FormGroup(
            {
                label: new FormControl('', [Validators.required, this.duplicatedLabel.bind(this)]),
                establishmentName: new FormControl('', [Validators.required]),
                addressLine1: new FormControl('', [Validators.required]),
                addressLine2: new FormControl(''),
                zipCode: new FormControl('', [Validators.required]),
                city: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
                iban: new FormControl('', [Validators.required, CustomValidators.ibanValidator]),
                bic: new FormControl('', [Validators.required, CustomValidators.bicValidator]),
            },
        );
    }

    /**
     * Handle edit button click
     * @param address
     * @return void
     */
    handleEdit(address): void {
        this.setupFormGroup();
        const subPortfolio = this.addressList.find((subPortfolio) => {
            return subPortfolio.addr === address;
        });

        Object.keys(subPortfolio).forEach((item) => {
            if (this.tabDetail[0]['formControl'].controls[item]) {
                this.tabDetail[0]['formControl'].controls[item].patchValue(subPortfolio[item]);
            }
        });
        this.currentAddress = address;
        this.editForm = true;
        this.showFormModal = true;
    }

    /**
     * Toggle the Form Modal visibility and reset formGroup
     * @return void
     */
    toggleFormModal() {
        this.setupFormGroup();
        this.editForm = false;
        this.showFormModal = !this.showFormModal;
    }

    /**
     * Save a new Sub-portfolio
     * @return void
     */
    saveSubPortfolio() {
        const values = this.tabDetail[0]['formControl'].value;

        const asyncTaskPipe = this.ofiSubPortfolioReqService.saveNewSubPortfolio({
            walletId: this.connectedWalletId,
            label: values.label,
            establishmentName: values.establishmentName,
            addressLine1: values.addressLine1,
            addressLine2: values.addressLine2,
            zipCode: values.zipCode,
            city: values.city,
            country: _.get(values, 'country[0].id', values.country),
            iban: values.iban,
            bic: values.bic,
        });

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
     * Update an existing Sub-portfolio
     * @return void
     */
    updateSubPortfolio() {
        const values = this.tabDetail[0]['formControl'].value;
        const asyncTaskPipe = this.ofiSubPortfolioReqService.updateSubPortfolio({
            walletId: this.connectedWalletId,
            option: this.currentAddress,
            label: values.label,
            establishmentName: values.establishmentName,
            addressLine1: values.addressLine1,
            addressLine2: values.addressLine2,
            zipCode: values.zipCode,
            city: values.city,
            country: _.get(values, 'country[0].id', values.country),
            iban: values.iban,
            bic: values.bic,
        });

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
                                this.ngRedux.dispatch(clearRequestedWalletLabel());
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
                    case 'required' :
                        return this.translate.translate('Field is required');
                    case 'iban':
                        return this.translate.translate('IBAN must be 14 to 34 characters long with 2 letters at the beginning');
                    case 'bic':
                        return this.translate.translate('BIC must be 11 characters, ISO 9362, if 9 to 11 are empty then put "XXX"');
                    case 'duplicatedLabel':
                        return this.translate.translate('This sub-portfolio name is already used. Please choose another one');
                    default :
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
                    if (this.currentAddress !== addr.addr) return { duplicatedLabel: true };
                }
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    /* USER TOUR CURRENTLY INACTIVE */
    restartUserTour() {
        if (this.connectedWalletId > 0) {
            setTimeout(
                () => {
                    const asyncTaskPipe = this.userTourService.saveUserTour({
                        type: userToursEnums.names.utmysubportfolios,
                        value: 0,
                        walletid: this.connectedWalletId,
                    });

                    this.ngRedux.dispatch({
                        type: 'RUN_ASYNC_TASK',
                        successTypes: (data) => {
                        },
                        failureTypes: (data) => {
                        },
                        descriptor: asyncTaskPipe,
                        args: {},
                        successCallback: (response) => {
                            UserTourService.setRequestedUserTours(false, this.ngRedux);
                        },
                        failureCallback: (response) => {
                            console.log('Error save userTour failed: ', response);
                        },
                    });
                },
                200,
            );
        }
    }

    launchTour() {
        this.tourObject = [];
        this.tourObject.push(
            {
                usertourName: userToursEnums.names.utmysubportfolios,
                title: this.translate.translate('My Sub-portfolios'),
                text: this.translate.translate(
                    'In this module, you will be able to create and manage your sub-porfolios. Sub-portfolios are' +
                    'the bank accounts that you will use to place orders on IZNES. You can create as many sub-portfolios as you want, depending on your investments objectives.'),
                target: 'menu-sub-portfolio',
            },
            {
                title: this.translate.translate('Add New Sub-portfolio'),
                text: this.translate.translate('You can add a new sub-portfolio by clicking on this button. You will need to provide a name and an IBAN for the sub-portfolio you want to create.'),
                target: 'btn-add-new-subportfolio',
            },
            {
                title: this.translate.translate('Manage your Sub-portfolios'),
                text: this.translate.translate('Once you have created your sub-porfolios, from this column "Actions", you will be able to edit or delete your sub-portfolios.'),
                target: 'subportfolios-col-actions',
            },
        );
        // TODO: disabled as user tour needs additional work in V2.1/2.2
        // this.showUsertour = true;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
