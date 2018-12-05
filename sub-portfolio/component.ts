import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { select, NgRedux } from '@angular-redux/store';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';
import { MultilingualService } from '@setl/multilingual';

import {
    MyWalletsService,
    WalletnodeTxService,
    WalletNodeRequestService,
    InitialisationService,
} from '@setl/core-req-services';

import {
    clearRequestedWalletLabel,
    setRequestedWalletAddresses,

} from '@setl/core-store';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { SagaHelper, immutableHelper, LogService } from '@setl/utils';

@Component({
    selector: 'app-manage-sub-portfolio',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ManageSubPortfolioComponent implements OnInit, OnDestroy {
    public tabsControl: any;

    addressList: any[];

    /* List of observable subscription. */
    subscriptionsArray: Subscription[] = [];

    connectedWalletId: number;
    requestedWalletAddress: boolean;

    /* Rows Per Page datagrid size */
    public pageSize: number;

    /* List of Redux observables. */
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;

    constructor(private ngRedux: NgRedux<any>,
                private alertsService: AlertsService,
                private myWalletService: MyWalletsService,
                private walletnodeTxService: WalletnodeTxService,
                private walletNodeRequestService: WalletNodeRequestService,
                private logService: LogService,
                private changeDetectorRef: ChangeDetectorRef,
                private route: ActivatedRoute,
                private router: Router,
                public translate: MultilingualService,
        ) {

        this.connectedWalletId = 0;
        this.requestedWalletAddress = false;

        this.subscriptionsArray.push(this.connectedWalletOb.subscribe((connected) => {
            this.connectedWalletId = connected;
        }));
        this.subscriptionsArray.push(this.addressListOb.subscribe((addressList) => {
            this.updateAddressList(addressList);
        }));
        this.subscriptionsArray.push(this.requestedAddressListOb.subscribe((requested) => {
            this.requestAddressList(requested);
        }));
        this.subscriptionsArray.push(this.requestedLabelListOb.subscribe((requested) => {
            this.requestWalletLabel(requested);
        }));
    }

    /**
     * Gets the wallet addresses.
     *
     * @param {index} requestedState
     *
     * @return {void}
     */
    requestAddressList(requestedState) {
        this.requestedWalletAddress = requestedState;
        this.logService.log('requested wallet address', this.requestedWalletAddress);

        /* If the state is false, that means we need to request the list. */
        if (!requestedState && this.connectedWalletId !== 0) {
            /* Set the state flag to true. so we do not request it again. */
            this.ngRedux.dispatch(setRequestedWalletAddresses());

            /* Request the list. */
            InitialisationService.requestWalletAddresses(
                this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    /**
     * Updates the wallet address list.
     *
     * @param {object} addressList
     *
     * @return {void}
     */
    updateAddressList(addressList) {
        this.logService.log('addressList: ', addressList);

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

    /**
     * Gets the wallet labels.
     *
     * @param {index} requestedState
     *
     * @return {void}
     */
    requestWalletLabel(requestedState) {
        this.logService.log('checking requested', this.requestedWalletAddress);

        /* If the state is false, that means we need to request the list. */
        if (!requestedState && this.connectedWalletId !== 0) {
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
    }

    ngOnInit() {
        this.setInitialTabs();

        this.subscriptionsArray['routeParam'] = this.route.params.subscribe((params: Params) => {
            const tabId = _.get(params, 'portfolioid', 0);
            this.setTabActive(tabId);
        });
    }

    /**
     * Sets the default tabs.
     *
     * @return {boolean}
     */
    setInitialTabs() {
        this.tabsControl = [
            {
                title: {
                    icon: 'fa-search',
                    text: this.translate.translate('Search'),
                },
                active: true,
            },
            {
                title: {
                    icon: 'fa-plus',
                    text: this.translate.translate('Add New Sub-portfolio'),
                },
                formControl: this.createSubPortfolioFormGroup(),
                active: false,
            },
        ];

        return true;
    }

    /**
     * Sets all tabs to inactive except for the selected/active tab.
     *
     * @param {index} [number] - The ID of the tab to open.
     *
     * @return {void}
     */
    public setTabActive(index: number = 0) {
        this.tabsControl = immutableHelper.map(this.tabsControl, (item, thisIndex) => {
            return item.set('active', thisIndex === Number(index));
        });

        this.changeDetectorRef.detectChanges();
    }

    /**
     * Removes a tab from tabsControl.
     *
     * @param {number} tabId - The ID of the tab to remove.
     *
     * @return {void}
     */
    public removeTab(tabId: number) {
        this.tabsControl = [
            ...this.tabsControl.slice(0, tabId),
            ...this.tabsControl.slice(tabId + 1, this.tabsControl.length),
        ];
    }

    /**
     * Refreshes a tab.
     *
     * @param {number} tabId - The ID of the tab to refresh.
     *
     * @return {void}
     */
    public refreshTab(tabId: number) {
        /* Cache the tab data. */
        const address = this.tabsControl[tabId].address;
        const name = this.tabsControl[tabId].formControl.controls.name.value;
        const iban = this.tabsControl[tabId].formControl.controls.iban.value;

        /* Remove the tab from tabsControl. */
        this.removeTab(tabId);

        /* Recreate the tab from cached data. */
        this.tabsControl.push({
            title: {
                icon: 'fa-pencil',
                text: `${this.translate.translate('Edit')} ${name}`,
            },
            formControl: this.createSubPortfolioFormGroup(name, iban),
            active: true,
            address,
        });
    }

    /**
     * Removes a tab from tabsControl to close it.
     *
     * @param {number} tabId - The ID of the tab to close.
     *
     * @return {void}
     */
    public closeTab(tabId: number) {
        if (!tabId && tabId !== 0) {
            return;
        }

        /* Remove the tab from tabsControl. */
        this.removeTab(tabId);

        /* Navigate to the sub-portfolio list. */
        this.router.navigateByUrl('/user-administration/subportfolio/0');
        return;
    }

    /**
     * Clears the add sub-portfolio form.
     *
     * @param {number} tabid - The ID of the tab to clear.
     *
     * @return {void}
     */
    public clearAddSubportfolioForm(tabid): void {
        /* Let's set all the values in the form controls. */
        this.tabsControl[tabid].formControl.reset();
        return;
    }

    /**
     * Creates a sub-portfolio form.
     *
     * @param {string} [name] - The name of the sub-portfolio.
     * @param {string} [iban] - The iban of the sub-portfolio.
     *
     * @return {FormGroup} - The form group.
     */
    public createSubPortfolioFormGroup(name = null, iban = null) {
        const formGroup = new FormGroup(
            {
                name: new FormControl(name || '', [Validators.required]),
                iban: new FormControl(iban || '', [
                    Validators.required,
                    Validators.minLength(14),
                    Validators.maxLength(34),
                ]),
            },
        );

        return formGroup;
    }

    /**
     * Creates a tab for editing a sub-portfolio.
     *
     * @param {string} name - The name of the sub-portfolio.
     * @param {string} iban - The iban of the sub-portfolio.
     *
     * @return {void}
     */
    createEditTab(name: string, iban: number, address: string): void {
        /* If a tab is already open for this sub-portfolio, navigate to it. */
        for (let i = 0; i < this.tabsControl.length; i += 1) {
            if (this.tabsControl[i].address === address) {
                this.router.navigateByUrl(`/user-administration/subportfolio/${i}`);

                return;
            }
        }

        /* Create a new tab for this sub-portfolio and populate the form with subportfolio data. */
        this.tabsControl.push({
            title: {
                icon: 'fa-pencil',
                text: `${this.translate.translate('Edit')} ${name}`,
            },
            formControl: this.createSubPortfolioFormGroup(name, iban),
            active: false,
            address,
        });

        const newTabId = this.tabsControl.length - 1;

        /* Navigate to the new tab. */
        this.router.navigateByUrl(`/user-administration/subportfolio/${newTabId}`);

        return;
    }

    /**
     * Saves a new sub-portfolio.
     *
     * @param {number} tabId - The tab containing the add form.
     *
     * @return {void}
     */
    addSubPortfolio(tabId: number) {
        /* Show a loading alert */
        this.alertsService.create('loading');

        const formData = this.tabsControl[tabId].formControl.value;

        /* Create an address. */
        const asynTaskPipe = this.walletnodeTxService.newAddress({ walletId: this.connectedWalletId });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asynTaskPipe,
            (data) => {
                const address = _.get(data, [1, 'data', 'address'], '');

                /* Create an address label. */
                const labelAsynTaskPipe = this.myWalletService.newWalletLabel({
                    walletId: this.connectedWalletId,
                    option: address,
                    label: formData.name,
                    iban: formData.iban.trim(),
                });

                this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    labelAsynTaskPipe,
                    (labelResponse) => {
                        this.ngRedux.dispatch(clearRequestedWalletLabel());
                        const message = _.get(labelResponse, '[1].Data[0].Message', 'All OK');
                        this.handleLabelResponse(message);
                        this.clearAddSubportfolioForm(tabId);
                    },
                    (labelResponse) => {
                        const message = `<span>${this.translate.translate('Portfolio address was created in the blockchain, but sub-portfolio was not created.')}</span>`;
                        this.alertsService.generate('error', message);
                    }));
            },
            (data) => {
                console.error('Fail', data);
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to create sub-portfolio.'),
                );
            }));
    }

    /**
     * Updates an existing sub-portfolio.
     *
     * @param {number} tabId - The ID of the tab containing the edit form.
     *
     * @return {void}
     */
    updateSubPortfolio(tabId: number) {
        /* Show a loading alert */
        this.alertsService.create('loading');

        /* Get the form data using the tabId. */
        const formData = this.tabsControl[tabId].formControl.value;

        /* Get the address using the tabId. */
        const address = this.tabsControl[tabId].address;

        const asyncTaskPipe = this.myWalletService.updateWalletLabel({
            walletId: this.connectedWalletId,
            option: address,
            label: formData.name,
            iban: formData.iban,
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (labelResponse) => {
                this.ngRedux.dispatch(clearRequestedWalletLabel());
                const message = _.get(labelResponse, '[1].Data[0].Message', 'All OK');
                this.handleLabelResponse((message === 'All OK') ? 'Updated' : message);
            },
            (labelResponse) => {
                console.error('Fail', labelResponse);
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to update sub-portfolio.'),
                );
            }));

        /* Update the tab with updated data. */
        this.refreshTab(tabId);
    }

    /**
     * Sets the alert message text.
     *
     * @param {string} message - The short form of the message.
     *
     * @return {void}
     */
    handleLabelResponse(message: string) {
        switch (message) {
            case 'All OK':
                this.alertsService.generate(
                    'success',
                    `<span mltag="txt_portfolio_created">${this.translate.translate('Sub-portfolio created.')}</span>`,
                );
                break;

            case 'Updated':
                this.alertsService.generate(
                    'success',
                    `<span>${this.translate.translate('Sub-portfolio updated.')}</span>`,
                );
                break;

            case 'Duplicate Label':
                this.alertsService.generate(
                    'warning',
                    `<span mltag="txt_subportfolioname_is_exist">
                    ${this.translate.translate('Sub-portfolio name already exists.')}</span>`,
                );
                break;

            case 'Duplicate IBAN':
                this.alertsService.generate(
                    'warning',
                    `<span mltag="txt_iban_is_exist">${this.translate.translate('IBAN has already exists.')}</span>`,
                );
                break;

            case 'Duplicate Label and IBAN':
                this.alertsService.generate(
                    'warning',
                    `<span mltag="txt_subportfolioname_and_iban_is_exist">
                    ${this.translate.translate('Sub-portfolio and IBAN already exist.')}</span>`,
                );
                break;

            default:
                this.alertsService.generate(
                    'success',
                    `<span mltag="txt_portfolio_created">${this.translate.translate('Sub-portfolio created.')}</span>`,
                );
                break;
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }

        this.changeDetectorRef.detach();
    }
}
