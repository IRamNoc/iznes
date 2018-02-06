/* Core / Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/* Redux. */
import {NgRedux, select} from '@angular-redux/store';
/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ConfirmationService, immutableHelper} from '@setl/utils';
/* User Admin Service. */
import {PersistService} from '@setl/core-persist/';
import {UserAdminService} from '../useradmin.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import _ from 'lodash';
import {managedWalletsActions} from '@setl/core-store';

/* Decorator. */
@Component({
    selector: 'setl-admin-wallets',
    templateUrl: 'wallets.component.html',
    styleUrls: ['wallets.component.css'],
    providers: [UserAdminService],
    changeDetection: ChangeDetectionStrategy.OnPush
})

/* Class. */
export class AdminWalletsComponent implements AfterViewInit, OnDestroy {
    public walletList: any;
    public filteredWalletList: any;
    /* Tabs control */
    public tabsControl: any = [];
    /* Wallet List. */
    @select(['wallet', 'managedWallets', 'walletList']) walletsListOb;
    /* Types lists. */
    private accountTypes: any;
    private walletTypes: any;
    private countriesList: any;
    /* Subscriptions from service observables. */
    private subscriptions: { [key: string]: any } = {};

    /* Constructor. */
    constructor(private userAdminService: UserAdminService,
                private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private route: ActivatedRoute,
                private router: Router,
                private alertsService: AlertsService,
                private _confirmationService: ConfirmationService,
                private _persistService: PersistService) {
        
        /* Get Countries list. */
        this.countriesList = this.userAdminService.countries;

        this.setInitialTabs();

        this.subscriptions['routeParam'] = this.route.params.subscribe((params: Params) => {
            const tabId = _.get(params, 'walletid', 0);
            this.setTabActive(tabId);
        });
    }

    ngAfterViewInit(): void {
        /* Get account types. */
        this.accountTypes = this.userAdminService.getAccountTypes();

        /* Get wallet types. */
        this.walletTypes = this.userAdminService.getWalletTypes();

        /* Subscribe to the wallets list. */
        this.subscriptions['walletList'] = this.walletsListOb.subscribe((list) => {
            /* Set wallet list, as an array. */
            let i;
            this.walletList = [];
            for (i in list) {
                /* Add an index to be user by the handle functions. */
                list[i].index = this.walletList.length;

                /* Add the type name. */
                list[i].walletTypeName = this.userAdminService.getWalletTypeById(list[i].walletType)[0].text;

                /* then push. */
                this.walletList.push(list[i]);
            }

            console.log('wallet list: ', this.walletList);

            /* Also filter a new list for ui elements. */
            this.filteredWalletList = this.walletList.map((wallet) => {
                return {
                    id: wallet.walletId,
                    text: wallet.walletName
                };
            });

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        /* Ask for update from the service above. */
        this.userAdminService.updateState();
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (var key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }

        this.ngRedux.dispatch(managedWalletsActions.setAllTabs(this.tabsControl));
    }

    setInitialTabs() {
        // Get opened tabs from redux store.
        const openedTabs = immutableHelper.get(this.ngRedux.getState(), ['wallet', 'managedWallets', 'openedTabs']);

        if (_.isEmpty(openedTabs)) {
            /* Default tabs. */
            this.tabsControl = [
                {
                    'title': {
                        'icon': 'fa-search',
                        'text': 'Search'
                    },
                    'walletId': -1,
                    'active': true
                },
                {
                    'title': {
                        'icon': 'fa-user',
                        'text': 'Add Wallet'
                    },
                    'walletId': -1,
                    'formControl': this.newWalletFormGroup(),
                    'active': false
                }
            ];

            this.resetAddNewWalletForm();

            return true;
        }

        this.tabsControl = openedTabs;
        this.tabsControl[1].formControl = this._persistService.watchForm('useradmin/newWallet', this.tabsControl[1].formControl);
    }

    /**
     * Handle New Wallet
     * ---------------
     * Handles saving a new wallet.
     *
     * @param {tabid} - the tab id that the form is in.
     *
     * @return {void}
     */
    public handleNewWallet(tabid: number): void {
        /* Variables. */
        const thisTab = this.tabsControl[tabid];
        let
            formData = thisTab.formControl.value,
            newWallet: any = {};

        /* If the form is not valid, don't submit. */
        if (!thisTab.formControl.valid) {
            this.showError('Please complete this form before submitting it.');
            return;
        }

        /* Start building the new wallet request object. */
        newWallet.walletName = formData.walletName;
        newWallet.walletAccount = formData.walletAccount[0].id;
        newWallet.walletType = formData.walletType[0].id;

        /* Add other fields depending on walletType. */
        if (newWallet.walletType === '1') {
            const walletAddrCountry = (formData.walletAddrCountry.length > 0) ? formData.walletAddrCountry[0].text : '';
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

            /* Legal basic fields. */
            newWallet.walletUid = formData.walletUid;
            newWallet.walletLei = formData.walletLei;
            newWallet.walletWebUrl = formData.walletWebUrl;
            newWallet.walletIncDate = (formData.walletIncDate) ? formData.walletIncDate : formattedDate;

            /* Legal corresondence. */
            newWallet.walletAddrCountry = walletAddrCountry;
            newWallet.walletAddrPrefix = formData.walletAddrPrefix;
            newWallet.walletAddr1 = formData.walletAddr1;
            newWallet.walletAddr2 = formData.walletAddr2;
            newWallet.walletAddr3 = formData.walletAddr3;
            newWallet.walletAddr4 = formData.walletAddr4;
            newWallet.walletAddrPostcode = formData.walletAddrPostcode;
        } else if (newWallet.walletType === '2') {
            /* Individual basic fields. */
            newWallet.aliases = (formData.aliases.length > 0) ? formData.aliases : '';
            newWallet.formerName = formData.formerName;
            newWallet.idCardNum = formData.idCardNum;

            /* Individual residential address. */
            newWallet.rdaAddrCountry = (formData.rdaAddrCountry.length > 0) ? formData.rdaAddrCountry[0].text : '';
            newWallet.rdaAddrPrefix = formData.rdaAddrPrefix;
            newWallet.rdaAddr1 = formData.rdaAddr1;
            newWallet.rdaAddr2 = formData.rdaAddr2;
            newWallet.rdaAddr3 = formData.rdaAddr3;
            newWallet.rdaAddr4 = formData.rdaAddr4;
            newWallet.rdaAddrPostcode = formData.rdaAddrPostcode;

            const caAddrCountry = (formData.caAddrCountry.length > 0) ? formData.caAddrCountry[0].text : '';

            /* Individual corresondence address, if caSame is set, then we'll use the rda. */
            newWallet.caAddrCountry = formData.caSame ? newWallet.rdaAddrCountry : caAddrCountry;
            newWallet.caAddrPrefix = formData.caSame ? newWallet.rdaAddrPrefix : formData.caAddrPrefix;
            newWallet.caAddr1 = formData.caSame ? newWallet.rdaAddr1 : formData.caAddr1;
            newWallet.caAddr2 = formData.caSame ? newWallet.rdaAddr2 : formData.caAddr2;
            newWallet.caAddr3 = formData.caSame ? newWallet.rdaAddr3 : formData.caAddr3;
            newWallet.caAddr4 = formData.caSame ? newWallet.rdaAddr4 : formData.caAddr4;
            newWallet.caAddrPostcode = formData.caSame ? newWallet.rdaAddrPostcode : formData.caAddrPostcode;

            /* Individual settlement detail. */
            newWallet.bankWalletId = (formData.bankWalletId) ? formData.bankWalletId[0].id : 0;
            newWallet.bankName = formData.bankName;
            newWallet.bankIBAN = formData.bankIBAN;
            newWallet.bankBICcode = formData.bankBICcode;
            newWallet.bankAccountName = formData.bankAccountName;
            newWallet.bankAccountNum = formData.bankAccountNum;
            newWallet.bdAddrCountry = (formData.bdAddrCountry.length > 0) ? formData.bdAddrCountry[0].text : '';
            newWallet.bdAddrPrefix = formData.bdAddrPrefix;
            newWallet.bdAddr1 = formData.bdAddr1;
            newWallet.bdAddr2 = formData.bdAddr2;
            newWallet.bdAddr3 = formData.bdAddr3;
            newWallet.bdAddr4 = formData.bdAddr4;
            newWallet.bdAddrPostcode = formData.bdAddrPostcode;
        }

        /* Send the creation request. */
        this.userAdminService.createNewWallet(newWallet)
            .then(() => {
                /* Handle response. */
                this.showSuccess('Successfully created the new wallet.');
            })
            .catch(() => {
                /* Show error if we failed to create the wallet. */
                this.showError('Failed to create the new wallet.');
            });

        /* Clear the new wallet form. */
        this.clearNewWallet(1, false);
    }

    /**
     * Handle Edit Wallet
     * ----------------
     * Handles saving an edited wallet.
     *
     * @param {number} tabid The formcontrol object that relates
     * to this edit form tab.
     * @return {void}
     */
    public handleEditWallet(tabid: number): void {
        /* Variables. */
        const thisTab = this.tabsControl[tabid];
        let
            formData = thisTab.formControl.value,
            editWalletData: any = {};

        /* If the form is not valid, don't submit. */
        if (!thisTab.formControl.valid) {
            this.showError('Please complete this form before submitting it.');
            return;
        }

        /* Start building the updateWallet request object. */
        editWalletData.walletId = thisTab.walletId;
        editWalletData.walletName = formData.walletName;
        editWalletData.walletAccount = formData.walletAccount[0].id;
        editWalletData.walletType = formData.walletType[0].id;
        editWalletData.walletLocked = formData.walletLocked ? 1 : 0; // inverted for the ui, so switch back.

        /* Add other fields depending on walletType. */
        if (editWalletData.walletType === '1') {
            /* Legal basic fields. */
            editWalletData.walletUid = formData.walletUid;
            editWalletData.walletLei = formData.walletLei;
            editWalletData.walletWebUrl = formData.walletWebUrl;
            editWalletData.walletIncDate = formData.walletIncDate;

            /* Legal corresondence. */
            editWalletData.walletAddrCountry = formData.walletAddrCountry[0].text;
            editWalletData.walletAddrPrefix = formData.walletAddrPrefix;
            editWalletData.walletAddr1 = formData.walletAddr1;
            editWalletData.walletAddr2 = formData.walletAddr2;
            editWalletData.walletAddr3 = formData.walletAddr3;
            editWalletData.walletAddr4 = formData.walletAddr4;
            editWalletData.walletAddrPostcode = formData.walletAddrPostcode;

        } else if (editWalletData.walletType === '2') {
            /* Individual basic fields. */
            editWalletData.aliases = formData.aliases;
            editWalletData.formerName = formData.formerName;
            editWalletData.idCardNum = formData.idCardNum;

            /* Individual residential address. */
            editWalletData.rdaAddrCountry = formData.rdaAddrCountry[0].text;
            editWalletData.rdaAddrPrefix = formData.rdaAddrPrefix;
            editWalletData.rdaAddr1 = formData.rdaAddr1;
            editWalletData.rdaAddr2 = formData.rdaAddr2;
            editWalletData.rdaAddr3 = formData.rdaAddr3;
            editWalletData.rdaAddr4 = formData.rdaAddr4;
            editWalletData.rdaAddrPostcode = formData.rdaAddrPostcode;

            /* Individual corresondence address. */
            editWalletData.caAddrCountry = formData.caAddrCountry[0].text;
            editWalletData.caAddrPrefix = formData.caAddrPrefix;
            editWalletData.caAddr1 = formData.caAddr1;
            editWalletData.caAddr2 = formData.caAddr2;
            editWalletData.caAddr3 = formData.caAddr3;
            editWalletData.caAddr4 = formData.caAddr4;
            editWalletData.caAddrPostcode = formData.caAddrPostcode;

            /* Individual settlement detail. */
            editWalletData.bankWalletId = formData.bankWalletId[0].id;
            editWalletData.bankName = formData.bankName;
            editWalletData.bankIBAN = formData.bankIBAN;
            editWalletData.bankBICcode = formData.bankBICcode;
            editWalletData.bankAccountName = formData.bankAccountName;
            editWalletData.bankAccountNum = formData.bankAccountNum;
            /* settlement address */
            editWalletData.bdAddrCountry = formData.bdAddrCountry[0].text;
            editWalletData.bdAddrPrefix = formData.bdAddrPrefix;
            editWalletData.bdAddr1 = formData.bdAddr1;
            editWalletData.bdAddr2 = formData.bdAddr2;
            editWalletData.bdAddr3 = formData.bdAddr3;
            editWalletData.bdAddr4 = formData.bdAddr4;
            editWalletData.bdAddrPostcode = formData.bdAddrPostcode;
        }

        /* Send the Update request. */
        this.userAdminService.updateWallet(editWalletData).then((response) => {
            let updatedWallet = '';
            if (response[1].Data[0]) {
                updatedWallet = response[1].Data[0];
            }
            // TODO Update Wallet Locked status
            /* Handle Success. */
            this.showSuccess('Successfully updated this wallet.');
        }).catch((error) => {
            /* Handle error. */
            this.showError('Failed to update this wallet.');
            console.warn(error);
        });

        /* Return */
        return;
    }

    /**
     * Get Wallet By Id
     * ----------------
     * Returns a wallet by Id.
     *
     * @param  {id} number - The id wanted.
     * @return {wallet|false} object of wallet or boolean false.
     */
    public getWalletById(id) {
        /* Variables. */
        let i;

        /* Loop over each wallet... */
        for (i in this.walletList) {
            /* ..check if this is the one wanted... */
            if (this.walletList[i].walletId == id) {
                /* ...return if so. */
                return this.walletList[i];
            }
        }

        /* If we get here, there was no wallet, so return false. */
        return false;
    }

    /**
     * Handle Delete
     * -------------
     * Handles the deletion of a wallet.
     *
     * @param {index} object - Contains the target wallet's index.
     *
     * @return {void}
     */
    public handleDelete(index): void {
        /* Get the wallet's ID. */
        let dataToSend = {};
        dataToSend['walletId'] = this.walletList[index].walletId;

        /* Let's now ask the user if they're sure... */
        this._confirmationService.create(
            '<span>Deleting a Wallet</span>',
            '<span>Are you sure you want to delete \'' + this.walletList[index].walletName + '\'?</span>'
        ).subscribe((ans) => {
            /* ...if they are... */
            if (ans.resolved) {
                /* ...now send the request. */
                this.userAdminService.deleteWallet(dataToSend).then((response) => {
                    /* Close a edit tab for this wallet if it's open. */
                    for (let i in this.tabsControl) {
                        if (this.tabsControl[i].walletId == dataToSend['walletId']) {
                            this.closeTab(i);
                            break;
                        }
                    }

                    /* Handle success message. */
                    this.showSuccess('Successfully deleted wallet.');
                }).catch((error) => {
                    /* Handle error message. */
                    this.showError('Failed to delete wallet.');
                    console.warn(error);
                });
            }
        });

        /* Return. */
        return;
    }

    /**
     * Handle Edit
     * -----------
     * Handles the editting of a wallet.
     *
     * @param {index} number - The index of a wallet to be editted.
     *
     * @return {void}
     */
    public handleEdit(index): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i].walletId === this.walletList[index].walletId) {
                /* Found the index for that tab, lets activate it... */
                // this.setTabActive(i);
                this.router.navigateByUrl('/user-administration/wallets/' + i);

                /* And return. */
                return;
            }
        }

        /* Reference the wallet. */
        const wallet = this.walletList[index];

        /* Now push the new tab object into the array. */
        this.tabsControl.push({
            'title': {
                'icon': 'fa-user',
                'text': this.walletList[index].walletName
            },
            'walletId': wallet.walletId,
            'formControl': this.newWalletFormGroup(),
            'active': false // this.editFormControls
        });

        /* Variables and thisTab reference. */
        const thisTab = this.tabsControl[this.tabsControl.length - 1];
        let
            walletAccount = [{ id: wallet.accountId, text: wallet.accountName }],
            walletType = [{ id: wallet.walletType, text: wallet.walletTypeName }],
            resolvedCountry, selectWallet;

        /* Now let's patch the core values. */
        thisTab.formControl.controls['walletName'].patchValue(wallet.walletName);
        thisTab.formControl.controls['walletAccount'].patchValue(walletAccount);
        thisTab.formControl.controls['walletLocked'].patchValue(wallet.walletLocked === 0 ? false : true);
        thisTab.formControl.controls['walletType'].patchValue(walletType);

        /* Then figure out what type we are... then patch the values needed for the forms shown.
           Wallet type legal. */
        if (wallet.walletType == 1) {
            /* Patch the legal meta data into the form. */
            thisTab.formControl.controls['walletLei'].patchValue(wallet.Glei || '');
            thisTab.formControl.controls['walletUid'].patchValue(wallet.uid || '');
            thisTab.formControl.controls['walletWebUrl'].patchValue(wallet.websiteUrl || '');
            let incDate = this.formatDate(wallet.incorporationData);
            thisTab.formControl.controls['walletIncDate'].patchValue(incDate || '');

            /* Patch the legal correspondence address into the form. */
            resolvedCountry = this.userAdminService.resolveCountries([{ text: wallet.country }]);
            thisTab.formControl.controls['walletAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['walletAddrPrefix'].patchValue(wallet.addressPrefix || '');
            thisTab.formControl.controls['walletAddr1'].patchValue(wallet.address1);
            thisTab.formControl.controls['walletAddr2'].patchValue(wallet.address2);
            thisTab.formControl.controls['walletAddr3'].patchValue(wallet.address3);
            thisTab.formControl.controls['walletAddr4'].patchValue(wallet.address4);
            thisTab.formControl.controls['walletAddrPostcode'].patchValue(wallet.postalCode);
        }
        /* Wallet type individual */
        else if (wallet.walletType == 2) {
            /* Patch the individual basic information into the form. */
            thisTab.formControl.controls['aliases'].patchValue(wallet.aliases || '');
            thisTab.formControl.controls['formerName'].patchValue(wallet.formerName || '');
            thisTab.formControl.controls['idCardNum'].patchValue(wallet.idCardNum || '');

            /* Patch the residential address into the form. */
            resolvedCountry = this.userAdminService.resolveCountries([{ text: wallet.rdaCountry }]);
            thisTab.formControl.controls['rdaAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['rdaAddrPrefix'].patchValue(wallet.rdaAddressPrefix || '');
            thisTab.formControl.controls['rdaAddr1'].patchValue(wallet.rdaAddress1 || '');
            thisTab.formControl.controls['rdaAddr2'].patchValue(wallet.rdaAddress2 || '');
            thisTab.formControl.controls['rdaAddr3'].patchValue(wallet.rdaAddress3 || '');
            thisTab.formControl.controls['rdaAddr4'].patchValue(wallet.rdaAddress4 || '');
            thisTab.formControl.controls['rdaAddrPostcode'].patchValue(wallet.rdaPostalCode || '');

            /* Patch the correspondence address into the form. */
            resolvedCountry = this.userAdminService.resolveCountries([{ text: wallet.caCountry }]);
            thisTab.formControl.controls['caAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['caAddrPrefix'].patchValue(wallet.caAddressPrefix || '');
            thisTab.formControl.controls['caAddr1'].patchValue(wallet.caAddress1 || '');
            thisTab.formControl.controls['caAddr2'].patchValue(wallet.caAddress2 || '');
            thisTab.formControl.controls['caAddr3'].patchValue(wallet.caAddress3 || '');
            thisTab.formControl.controls['caAddr4'].patchValue(wallet.caAddress4 || '');
            thisTab.formControl.controls['caAddrPostcode'].patchValue(wallet.caPostalCode || '');

            /* Get the wallet selected by ID. */
            selectWallet = this.getWalletById(wallet.bankWalletId);
            if (selectWallet) {
                thisTab.formControl.controls['bankWalletId'].patchValue([{
                    id: selectWallet.walletId,
                    text: selectWallet.walletName
                }]);
            }

            /* Now patch the bank details into the form. */
            thisTab.formControl.controls['bankName'].patchValue(wallet.bankName || '');
            thisTab.formControl.controls['bankIBAN'].patchValue(wallet.bankIBAN || '');
            thisTab.formControl.controls['bankBICcode'].patchValue(wallet.bankBicCode || '');
            thisTab.formControl.controls['bankAccountName'].patchValue(wallet.bankAccountName || '');
            thisTab.formControl.controls['bankAccountNum'].patchValue(wallet.bankAccountNum || '');

            /* Patch the bank address into the form. */
            resolvedCountry = this.userAdminService.resolveCountries([{ text: wallet.bdCountry }]);
            thisTab.formControl.controls['bdAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['bdAddrPrefix'].patchValue(wallet.bdAddressPrefix || '');
            thisTab.formControl.controls['bdAddr1'].patchValue(wallet.bdAddress1 || '');
            thisTab.formControl.controls['bdAddr2'].patchValue(wallet.bdAddress2 || '');
            thisTab.formControl.controls['bdAddr3'].patchValue(wallet.bdAddress3 || '');
            thisTab.formControl.controls['bdAddr4'].patchValue(wallet.bdAddress4 || '');
            thisTab.formControl.controls['bdAddrPostcode'].patchValue(wallet.bdPostalCode || '');
        }

        /* Lastly, activate the new tab. */
        // this.setTabActive(this.tabsControl.length - 1);
        const newTabId = this.tabsControl.length - 1;
        this.router.navigateByUrl('/user-administration/wallets/' + newTabId);

        this.clearNewWallet(1, null);

        /* Return. */
        return;
    }

    /**
     * Close Tab
     * ---------
     * Removes a tab from the tabs control array, in effect, closing it.
     *
     * @param {index} number - the tab inded to close.
     *
     * @return {void}
     */
    public closeTab(index) {
        /* Validate that we have index. */
        if (!index && index !== 0) {
            return;
        }

        /* Remove the object from the tabsControl. */
        this.tabsControl = [
            ...this.tabsControl.slice(0, index),
            ...this.tabsControl.slice(index + 1, this.tabsControl.length)
        ];

        /* Reset tabs. */
        this.router.navigateByUrl('/user-administration/wallets/0');

        /* Return */
        return;
    }

    /**
     * Format Date
     * -----------
     * Formats a date into a nice string.
     *
     * @param  {date} any - A date string.
     * @return {datestring|false} - False if the date was invalid, a nice string
     * if it was.
     */
    public formatDate(date: any) {
        /* Variables. */
        const dateo = new Date(date);

        /* Let's check if the date object was instantiated correctly. */
        if (Object.prototype.toString.call(dateo) === '[object Date]') {
            /* Now let's check if the date object holds a valid date. */
            if (!isNaN(dateo.getTime())) {
                /* If all is good, return a nice string. */
                return dateo.getFullYear() + '-' + this.numberPad(dateo.getMonth()) + '-' + this.numberPad(dateo.getDate())
            }

            /* Not valid. */
            return false;
        }

        /* Not valid. */
        return false;
    }

    /**
     * Number Pad
     * ----------
     * Returns a padded number.
     *
     * @param  {num} number - the number that needs padding.
     * @return {paddednum} string - a that was tested an padded if needed.
     */
    public numberPad(num) {
        /* examples:
         * 5 -> "05"
         * 12 -> "12"
         */
        return num < 10 ? '0' + num : num.toString();
    }

    /**
     * Set Tab Active
     * --------------
     * Sets all tabs to inactive other than the given index, this means the
     * view is switched to the wanted tab.
     *
     * @param {index} number - the tab inded to close.
     *
     * @return {void}
     */
    public setTabActive(index: number = 0) {
        this.tabsControl = immutableHelper.map(this.tabsControl, (item, thisIndex) => {
            return item.set('active', thisIndex === Number(index));
        });
    }

    /**
     * Clear New User
     * --------------
     * Clears the new user form, i.e, sets all inputs to not filled.
     *
     * @param {tabid} number - the tabs to clear (will always be 1).
     *
     * @return {void}
     */
    public clearNewWallet(tabid, event): void {
        /* Prevent submit. */
        if (event) {
            event.preventDefault();
        }

        /* Let's set all the values in the form controls. */
        this.tabsControl[tabid].formControl = this.newWalletFormGroup();
        this.resetAddNewWalletForm();

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        /* Return. */
        return;
    }

    /**
     * Show Success Message
     * ------------------
     * Shows an success popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    showSuccess(message) {
        /* Show the message. */
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

    resetAddNewWalletForm() {
        this.tabsControl[1].formControl.controls['walletName'].setValue('');
        this.tabsControl[1].formControl.controls['walletAccount'].setValue([]);
        this.tabsControl[1].formControl.controls['walletType'].setValue([]);

        this.changeDetectorRef.markForCheck();
    }

    private newWalletFormGroup(): FormGroup {
        const group = new FormGroup(
            {
                /* Core wallet fields. */
                'walletName': new FormControl('', [
                    Validators.required,
                    Validators.maxLength(200)
                ]),
                'walletAccount': new FormControl([], [
                    Validators.required
                ]),
                'walletLocked': new FormControl(false, [
                    Validators.required
                ]),
                'walletType': new FormControl([], [
                    Validators.required
                ]),

                /* Legal type Fields. */
                'walletLei': new FormControl(''),
                'walletUid': new FormControl(''),
                'walletWebUrl': new FormControl(''),
                'walletIncDate': new FormControl(''),

                'walletAddrCountry': new FormControl(''),
                'walletAddrPrefix': new FormControl(''),
                'walletAddr1': new FormControl(''),
                'walletAddr2': new FormControl(''),
                'walletAddr3': new FormControl(''),
                'walletAddr4': new FormControl(''),
                'walletAddrPostcode': new FormControl(''),

                /* Individual type Fields. */
                'aliases': new FormControl([]),
                'formerName': new FormControl(''),
                'idCardNum': new FormControl(''),

                'rdaAddrCountry': new FormControl([]),
                'rdaAddrPrefix': new FormControl(''),
                'rdaAddr1': new FormControl(''),
                'rdaAddr2': new FormControl(''),
                'rdaAddr3': new FormControl(''),
                'rdaAddr4': new FormControl(''),
                'rdaAddrPostcode': new FormControl(''),

                'caSame': new FormControl(false),
                'caAddrCountry': new FormControl([]),
                'caAddrPrefix': new FormControl(''),
                'caAddr1': new FormControl(''),
                'caAddr2': new FormControl(''),
                'caAddr3': new FormControl(''),
                'caAddr4': new FormControl(''),
                'caAddrPostcode': new FormControl(''),

                'bankWalletId': new FormControl(''),
                'bankName': new FormControl(''),
                'bankIBAN': new FormControl(''),
                'bankBICcode': new FormControl(''),
                'bankAccountName': new FormControl(''),
                'bankAccountNum': new FormControl(''),

                'bdAddrCountry': new FormControl([]),
                'bdAddrPrefix': new FormControl(''),
                'bdAddr1': new FormControl(''),
                'bdAddr2': new FormControl(''),
                'bdAddr3': new FormControl(''),
                'bdAddr4': new FormControl(''),
                'bdAddrPostcode': new FormControl(''),
            }
        );

        return this._persistService.watchForm('useradmin/newWallet', group);
    }

    /**
     * Show Error Message
     * ------------------
     * Shows an error popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showError(message) {
        /* Show the error. */
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

    /**
     * Show Warning Message
     * ------------------
     * Shows a warning popup.
     *
     * @param  {message} string - the string to be shown in the message.
     * @return {void}
     */
    private showWarning(message) {
        /* Show the error. */
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
