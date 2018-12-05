// Vendor
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

// Internal
import { MyWalletsService, WalletNodeRequestService } from '@setl/core-req-services';
import { clearRequestedWalletLabel } from '@setl/core-store';
import { OfiSubPortfolioService } from './service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { SagaHelper, immutableHelper, LogService, ConfirmationService } from '@setl/utils';
import { OfiSubPortfolioReqService } from '@ofi/ofi-main/ofi-req-services/ofi-sub-portfolio/service';
import { MultilingualService } from '@setl/multilingual';
import { userToursEnums } from '@setl/core-req-services/usertour/config';
import { UserTourService } from '@setl/core-req-services/usertour/service';
import { MyUserService } from '@setl/core-req-services/my-user/my-user.service';
import { fundItems } from '@ofi/ofi-main/ofi-product/productConfig';

@Component({
    selector: 'ofi-sub-portfolio',
    styleUrls: ['./component.scss'],
    providers: [OfiSubPortfolioService],
    templateUrl: './component.html',
})

export class OfiSubPortfolioComponent implements OnDestroy {
    addressObject: any;
    addressList: Array<any>;
    subscriptionsArray: Array<Subscription> = [];

    tabDetail: Array<object>;

    connectedWalletId: number = 0;
    requestedWalletAddress: boolean = false;

    showAddModal: boolean = false;

    showUsertour = false;
    private tourObject = [];

    showAddress: boolean = false;
    currentAddress: string;
    editForm: boolean = false;

    countries = fundItems.domicileItems;

    // List of Redux observable
    @select(['user', 'siteSettings', 'language']) languageOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['user', 'myDetail', 'defaultHomePage']) defaultHomePageOb;
    @select(['ofi', 'sub-portfolio', 'requested']) subPortfolioRequestedOb;
    @select(['ofi', 'ofiSubPortfolio', 'bankingDetails']) subPortfolioBankingDetailsOb;

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
                private changeDetectorRef: ChangeDetectorRef,
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
            console.log('+++ this.addressList', this.addressList);
        }));

        this.ofiSubPortfolioService.updateSubPortfolioObservable();

        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connected: number) => {
            this.connectedWalletId = connected;
        }));

        this.subscriptionsArray.push(this.languageOb.subscribe(() => {
            this.tabDetail[0]['title'].text = this.translate.translate('Manage Sub-portfolio');
            this.changeDetectorRef.markForCheck();
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
                iban: new FormControl('', [Validators.required, validateIBAN]),
                bic: new FormControl('', [Validators.required]),
            },
        );
    }

    /**
     * Handle edit button click
     * @param address
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
        this.editForm = true;
        this.showAddModal = true;
    }

    handleUpdateLabel(value, address, iban) {
        const asyncTaskPipe = this.myWalletService.updateWalletLabel({
            walletId: this.connectedWalletId,
            option: address,
            label: value,
            iban,
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (labelResponse) => {
                this.ngRedux.dispatch(clearRequestedWalletLabel());

                const message = _.get(labelResponse, '[1].Data[0].Message', 'OK');
                this.handleLabelResponse(message, 'updated');
            },
            (labelResponse) => {
                this.showErrorResponse(labelResponse);
            }));
    }

    handleLabelResponse(message, type) {
        switch (message) {
            case 'Duplicate Label':
                this.toaster.pop('error', this.translate.translate('Sub-portfolio name already exists'));
                break;

            default:
                this.toaster.pop('success', this.translate.translate(
                    'Your sub-portfolio @subPortfolioName@ has been successfully @actionType@. This may take a moment to update.', {
                        subPortfolioName: this.tabDetail[0]['formControl'].value.subPortfolioName,
                        actionType: type,
                    }));
                break;
        }
    }

    toggleAddModal() {
        this.editForm = false;
        this.showAddModal = !this.showAddModal;
    }

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
            country: _.get(values, 'country[0].id', ''),
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
                    this.closeAddModal();

                    // update the default home page to '/home'
                    if (this.isFirstAddress()) {
                        this.myUserService.updateHomePage('/home');
                    }
                }
            },
            () => {
                this.showErrorMessage(this.translate.translate('Error creating sub-portfolio'));
            }));
    }

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
            country: _.get(values, 'country[0].id', ''),
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
                    this.closeAddModal();
                }
            },
            () => {
                this.showErrorMessage(this.translate.translate('Error updating sub-portfolio'));
            }));
    }

    closeAddModal() {
        this.setupFormGroup();
        this.toggleAddModal();
        this.editForm = false;
    }

    handleDelete(address) {
        const index = this.addressList.findIndex(x => x.address === address);
        if (index > -1) {
            this.confirmationService.create(
                this.translate.translate(`Delete ${this.addressList[index].label} - ${this.addressList[index].iban}`), this.translate.translate('Are you sure you want to delete this sub-portfolio?'),
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

                    this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                        asyncTaskPipe,
                        (response) => {
                            if (String(response[1].Data) === '0') {
                                this.ngRedux.dispatch(clearRequestedWalletLabel());
                                this.toaster.pop('success', this.translate.translate('Your sub-portfolio @addressLabel@ has been successfully deleted. This may take a moment to update.', { 'addressLabel': this.addressList[index].label }));
                            } else {
                                this.showWarningResponse(this.translate.translate('You are not able to delete this sub-portfolio because it is not empty. If you want to delete it, you need to redeem all of your shares from this sub-portfolio'));
                            }
                        },
                        (labelResponse) => {
                            this.toaster.pop('error', this.translate.translate('Error deleting sub-portfolio'));
                        }));
                }
            });
        }
    }

    showErrorResponse(response) {
        const message = _.get(response, '[1].Data[0].Message', '');

        this.alertsService.create('error', `
                <table class='table grid'>
                    <tbody>
                        <tr>
                            <td class='text-center text-danger'>${this.translate.translate(message)}</td>
                        </tr>
                    </tbody>
                </table>
            `);
    }

    showErrorMessage(message) {
        this.alertsService.create('error', `
                <table class='table grid'>
                    <tbody>
                        <tr>
                            <td class='text-center text-danger'>${this.translate.translate(message)}</td>
                        </tr>
                    </tbody>
                </table>
            `);
    }

    showSuccessResponse(message) {
        this.alertsService.create('success', `
                        <table class='table grid'>

                            <tbody>
                                <tr>
                                    <td class='text-center text-success'>${this.translate.translate(message)}</td>
                                </tr>
                            </tbody>
                        </table>
                        `);
    }

    showWarningResponse(message) {
        this.alertsService.create('warning', `
                <table class='table grid'>
                    <tbody>
                        <tr>
                            <td class='text-center text-warning'>${this.translate.translate(message)}</td>
                        </tr>
                    </tbody>
                </table>
            `);
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
            const invalid = formControl.touched && !formControl.valid;

            if (invalid) {
                const errors = formControl.errors;

                // get the error keys.
                const errorKeys = Object.keys(errors);
                const firstErrorKey = errorKeys[0];

                switch (firstErrorKey) {
                    case 'required' :
                        return this.translate.translate('Field is required');
                    case 'ibanFail':
                        return this.translate.translate('IBAN must be 14 to 34 characters long with 2 letters at the beginning.');
                    case 'duplicatedLabel':
                        return this.translate.translate('This subportfolio name is already used. Please choose another one.');
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
     * form validator to check if wallet label is duplicated.
     */
    duplicatedLabel(control: FormControl) {
        const label = control.value;

        try {
            for (const addr of this.addressList) {
                const thisLabel = addr.label;

                if (thisLabel === label) {
                    return { duplicatedLabel: true };
                }
            }
        } catch (e) {
            return null;
        }
        return null;
    }

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
                text: this.translate.translate('In this module, you will be able to create and manage your sub-porfolios. Sub-portfolios are the bank accounts that you will use to place orders on IZNES. You can create as many sub-portfolios as you want, depending on your investments objectives.'),
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

function validateIBAN(c: FormControl) {
    const IBAN_REGEXP = new RegExp(/\b^[A-Za-z]{2}[A-Za-z0-9]{12,32}\b/);

    return IBAN_REGEXP.test(c.value) ? null : {
        ibanFail: true,
    };
}
