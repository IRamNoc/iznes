// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

// Internal
import {
    MyWalletsService,
    WalletNodeRequestService,
    InitialisationService,
} from '@setl/core-req-services';

import {
    clearRequestedWalletLabel,
    setRequestedWalletAddresses,
} from '@setl/core-store';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { SagaHelper, immutableHelper, LogService, ConfirmationService } from '@setl/utils';
import { OfiSubPortfolioService } from '../../ofi-req-services/ofi-sub-portfolio/service';
import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';
import { userToursEnums } from '@setl/core-req-services/usertour/config';
import { UserTourService } from '@setl/core-req-services/usertour/service';
import { MyUserService } from '@setl/core-req-services/my-user/my-user.service';

@Component({
    selector: 'ofi-sub-portfolio',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})

export class OfiSubPortfolioComponent implements OnInit, OnDestroy {
    addressObject: any;
    addressList: Array<any>;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    tabDetail: Array<object>;

    connectedWalletId: number;
    requestedWalletAddress: boolean;

    showAddModal: boolean = false;

    showUsertour = false;
    private tourObject = [];
    // userToursEnums: any;

    showAddress = {};

    // List of Redux observable
    @select(['user', 'siteSettings', 'language']) languageOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['user', 'myDetail', 'defaultHomePage']) defaultHomePageOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private myWalletService: MyWalletsService,
                private walletNodeRequestService: WalletNodeRequestService,
                private ofiSubPortfolioService: OfiSubPortfolioService,
                private confirmationService: ConfirmationService,
                private toaster: ToasterService,
                private logService: LogService,
                private userTourService: UserTourService,
                private myUserService: MyUserService,
                private changeDetectorRef: ChangeDetectorRef,
                public translate: MultilingualService,
        ) {

        /* tab meta */
        this.tabDetail = [{
            title: {
                text: this.translate.translate('Manage Sub-portfolio'),
                icon: 'fa-id-badge',
            },
        }];

        this.newForm();

        this.connectedWalletId = 0;
        this.requestedWalletAddress = false;

        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connected: number) => {
            this.connectedWalletId = connected;

            this.subscriptionsArray
            .push(this.addressListOb
            .subscribe((addressList: any) => {
                this.updateAddressList(addressList);
            }));

            this.subscriptionsArray
            .push(this.requestedAddressListOb
            .subscribe((requested: boolean) => {
                this.requestAddressList(requested);
            }));

            this.subscriptionsArray
            .push(this.requestedLabelListOb
            .subscribe((requested: boolean) => {
                this.requestWalletLabel(requested);
            }));

            this.subscriptionsArray
            .push(this.languageOb
            .subscribe(() => {
                this.tabDetail[0]['title'].text = this.translate.translate('Manage Sub-portfolio');
                this.changeDetectorRef.markForCheck();
            }));
        }));

        this.subscriptionsArray.push(this.defaultHomePageOb.subscribe((defaultHomePage) => {
            if (defaultHomePage === '/user-administration/subportfolio') {
                // launch the tour!
            }
        }));
    }

    newForm() {
        this.tabDetail[0]['formControl'] = new FormGroup(
            {
                subPortfolioName: new FormControl('', [Validators.required, this.duplicatedLabel.bind(this)]),
                subPortfolioIban: new FormControl('', [Validators.required, validateIBAN]),
            },
        );
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    updateAddressList(addressList) {
        this.logService.log('addressList: ', addressList);
        this.addressObject = addressList;

        this.addressList = immutableHelper.reduce(
            addressList,
            (result, item) => {
                const addressItem = {
                    address: item.get('addr', ''),
                    label: item.get('label', ''),
                    iban: item.get('iban', ''),
                    editing: false,
                };

                if (addressItem.iban !== '' && addressItem.address !== '') {
                    result.push(addressItem);
                }

                return result;
            },
            [],
        );

        this.changeDetectorRef.markForCheck();
    }

    requestAddressList(requestedState) {
        this.requestedWalletAddress = requestedState;
        this.logService.log('requested wallet address', this.requestedWalletAddress);

        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {
            // Set the state flag to true. so we do not request it again.
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            // Request the list.
            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requestedState) {
        this.logService.log('checking requested', this.requestedWalletAddress);
        // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {

            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
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

    ngOnInit() {
        // if home = subport then launch tour!
        // on save make home blank.
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
                    'Your sub-portfolio @subPortfolioName@ has been successfully @actionType@. This may take a moment to update.', { 'subPortfolioName': this.tabDetail[0]['formControl'].value.subPortfolioName, 'actionType': type }));
                break;
        }
    }

    toggleAddModal() {
        this.showAddModal = !this.showAddModal;
    }

    saveSubPortfolio() {
        const name = this.tabDetail[0]['formControl'].value.subPortfolioName;
        const iban = this.tabDetail[0]['formControl'].value.subPortfolioIban;

        const asyncTaskPipe = this.ofiSubPortfolioService.saveNewSubPortfolio({
            walletId: this.connectedWalletId,
            name,
            iban,
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (labelResponse) => {
                this.ngRedux.dispatch(clearRequestedWalletLabel());
                const message = _.get(labelResponse, '[1].Data[0].Message', 'OK');

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

    closeAddModal() {
        this.newForm();
        this.toggleAddModal();
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
                    const asyncTaskPipe = this.ofiSubPortfolioService.deleteSubPortfolio({
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
}

function validateIBAN(c: FormControl) {
    const IBAN_REGEXP = new RegExp(/\b^[A-Za-z]{2}[A-Za-z0-9]{12,32}\b/);

    return IBAN_REGEXP.test(c.value) ? null : {
        ibanFail: true,
    };
}
