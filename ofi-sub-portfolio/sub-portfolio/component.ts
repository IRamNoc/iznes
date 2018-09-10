// Vendor
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { fromJS } from 'immutable';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

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
    clearRequestedWalletAddresses,
} from '@setl/core-store';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { SagaHelper, immutableHelper, LogService, ConfirmationService } from '@setl/utils';
import { OfiSubPortfolioService } from '../../ofi-req-services/ofi-sub-portfolio/service';
import { OfiUmbrellaFundService } from '../../ofi-req-services/ofi-product/umbrella-fund/service';
import { OfiFundShareService } from '../../ofi-req-services/ofi-product/fund-share/service';
import { OfiFundService } from '../../ofi-req-services/ofi-product/fund/fund.service';
import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';
import { userToursEnums } from '@setl/core-req-services/usertour/config';
import { UserTourService } from '@setl/core-req-services/usertour/service';
import { MyUserService } from '@setl/core-req-services/my-user/my-user.service';

@Component({
    selector: 'ofi-sub-portfolio',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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

    createError: number = 0;

    // List of Redux observable.
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['user', 'myDetail', 'defaultHomePage']) defaultHomePageOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private _myWalletService: MyWalletsService,
                private _memberService: MemberService,
                private _walletnodeTxService: WalletnodeTxService,
                private _walletNodeRequestService: WalletNodeRequestService,
                private _ofiSubPortfolioService: OfiSubPortfolioService,
                private _confirmationService: ConfirmationService,
                public _translate: MultilingualService,
                private toaster: ToasterService,
                private logService: LogService,
                private _userTourService: UserTourService,
                private _myUserService: MyUserService,
                private changeDetectorRef: ChangeDetectorRef) {

        /* tab meta */
        this.tabDetail = [{
            title: {
                text: 'Manage sub-portfolio',
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
        }));

        this.subscriptionsArray.push(this.defaultHomePageOb.subscribe(defaultHomePage => {
            if (defaultHomePage == '/user-administration/subportfolio') {
                // launch the tour!
            }
        }));
    }

    newForm() {
        this.tabDetail[0]['formControl'] = new FormGroup(
            {
                subPortfolioName: new FormControl('', [Validators.required]),
                subPortfolioIban: new FormControl('', [validateIBAN]),
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
            // const

        this.addressList = immutableHelper.reduce(addressList, (result, item) => {

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
        },                                        []);

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
            InitialisationService.requestWalletAddresses(this.ngRedux, this._walletNodeRequestService, this.connectedWalletId);
        }
    }

    requestWalletLabel(requestedState) {

        this.logService.log('checking requested', this.requestedWalletAddress);
            // If the state is false, that means we need to request the list.
        if (!requestedState && this.connectedWalletId !== 0) {

            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this._myWalletService, this.connectedWalletId);
        }
    }

    restartUserTour() {
        if (this.connectedWalletId > 0) {
            setTimeout(() => {
                const asyncTaskPipe = this._userTourService.saveUserTour({
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
            },         200);
        }
    }

    launchTour() {
        this.tourObject = [];
        this.tourObject.push(
            {
                usertourName: userToursEnums.names.utmysubportfolios,
                title: this._translate.translate('My Sub-portfolios'),
                text: this._translate.translate('In this module, you will be able to create and manage your sub-porfolios. Sub-portfolios are the bank accounts that you will use to place orders on IZNES. You can create as many sub-portfolios as you want, depending on your investments objectives.'),
                target: 'menu-sub-portfolio',
            },
            {
                title: this._translate.translate('Add a new sub-portfolio'),
                text: this._translate.translate('You can add a new sub-portfolio by clicking on this button. You will need to provide a name and an IBAN for the sub-portfolio you want to create.'),
                target: 'btn-add-new-subportfolio',
            },
            {
                title: this._translate.translate('Manage your sub-portfolios'),
                text: this._translate.translate('Once you have created your sub-porfolios, from this column "Actions", you will be able to edit or delete your sub-portfolios.'),
                target: 'subportfolios-col-actions',
            },
            );
            // TODO: disabled as user tour needs additional work in V2.1/2.2
            //this.showUsertour = true;
    }

    ngOnInit() {

            //if home = subport then launch tour!

            //on save make home blank.

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
            iban,
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe,
                                                          (labelResponse) => {
                                                              this.ngRedux.dispatch(clearRequestedWalletLabel());

                                                              const message = _.get(labelResponse, '[1].Data[0].Message', 'All OK');
                                                              this.handleLabelResponse(message, 'updated', address);
                                                          },(labelResponse) => {
                                                            this.showErrorResponse(labelResponse);
                                                        }));

    }

    handleLabelResponse(message, type, address) {
        switch (message) {
        case 'Duplicate Label':
            this.toaster.pop('error', 'Sub-portfolio name already exists');
            break;

        case 'Duplicate IBAN':
            this.toaster.pop('error', 'IBAN already exists');
            break;

        case 'Duplicate Label and IBAN':
            this.toaster.pop('error', 'This subportfolio already exists. Please choose another name and IBAN');
            break;

        default:
            this.toaster.pop('success', 'Your sub-portfolio ' + this.tabDetail[0]['formControl'].value.subPortfolioName + ' has been successfully ' + type + '. This may take a moment to update.');
            break;
        }
    }

    toggleAddModal() {
        this.showAddModal = !this.showAddModal;
    }

    saveSubPortfolio(type) {
        const name = this.tabDetail[0]['formControl'].value.subPortfolioName;
        const iban = this.tabDetail[0]['formControl'].value.subPortfolioIban;

        const asyncTaskPipe = this._ofiSubPortfolioService.saveNewSubPortfolio({
            walletId: this.connectedWalletId,
            name,
            iban,
            type,
        });

        this.createError = 0;

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe,
                                                          (labelResponse) => {
                                                              this.ngRedux.dispatch(clearRequestedWalletLabel());
                                                              const message = _.get(labelResponse, '[1].Data[0].Message', 'All OK');

                                                              if (message == 'All OK' && type == 1) {
                                                                this.handleLabelResponse(message, 'created', '');
                                                                this.closeAddModal();

                        // update the default home page to '/home'
                                                                if (this.isFirstAddress()) {
                                                                    this._myUserService.updateHomePage('/home');
                                                                }
                                                            }

                                                              if (message != 'All OK') this.createError = message;
                                                          },
                                                          (labelResponse) => {
                                                              this.showErrorMessage('<span mltag="txt_sub_fail">' +
                        'Error creating subportfolio' +
                        '</span>');
                                                          }));
    }

    closeAddModal() {
        this.newForm();
        this.createError = 0;
        this.toggleAddModal();
    }

    handleDelete(address) {

        const index = this.addressList.findIndex(x => x.address === address);
        if (index > -1) {
            this._confirmationService.create('Delete ' + this.addressList[index].label + ' - ' + this.addressList[index].iban, 'Are you sure you want to delete this sub-portfolio?', {
                confirmText: 'Delete',
                declineText: 'Cancel',
                btnClass: 'error',
            }).subscribe((ans) => {
                if (ans.resolved) {
                    const asyncTaskPipe = this._ofiSubPortfolioService.deleteSubPortfolio({
                        walletId: this.connectedWalletId,
                        address,
                    });

                    this.ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe,
                                                                      (response) => {
                                                                          if (response[1].Data == '0') {
                                                                                this.ngRedux.dispatch(clearRequestedWalletLabel());
                                                                                this.toaster.pop('success', 'Your sub-portfolio ' + this.addressList[index].label + ' has been successfully deleted.  This may take a moment to update.');
                                                                            } else {
                                                                                this.showWarningResponse('You are not able to delete this sub-portfolio because it is not empty. If you want to delete it, you need to redeem all of your shares from this sub-portfolio');
                                                                            }
                                                                      },
                                                                      (labelResponse) => {
                                                                          this.toaster.pop('error', '<span mltag="txt_sub_fail">' +
                                    'Error deleting subportfolio' +
                                    '</span>');
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
                            <td class='text-center text-danger'>${message}</td>
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
                            <td class='text-center text-danger'>${message}</td>
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
                                    <td class='text-center text-success'>${message}</td>
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
                            <td class='text-center text-warning'>${message}</td>
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

}

function validateIBAN(c: FormControl) {
    const IBAN_REGEXP = new RegExp(/\b^[A-Za-z]{2}[A-Za-z0-9]{12,32}\b/);

    return IBAN_REGEXP.test(c.value) ? null : {
        ibanFail: true,
    };
}
