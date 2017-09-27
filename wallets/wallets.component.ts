/* Core / Angular imports. */
import {Component, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {FormsModule, FormGroup, FormControl, NgModel, Validators} from '@angular/forms';
import {OnDestroy} from '@angular/core';

/* Redux. */
import {select, NgRedux} from '@angular-redux/store';

/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ConfirmationService} from '@setl/utils';

/* User Admin Service. */
import {UserAdminService} from '../useradmin.service';

/* Decorator. */
@Component({
    selector: 'setl-admin-wallets',
    templateUrl: 'wallets.component.html',
    styleUrls: ['wallets.component.css'],
    providers: [UserAdminService]
})

/* Class. */
export class AdminWalletsComponent implements AfterViewInit, OnDestroy {
    /* Wallet List. */
    @select(['wallet', 'managedWallets', 'walletList']) walletsListOb;
    public walletList: any;
    public filteredWalletList: any;

    /* Types lists. */
    private accountTypes: any;
    private walletTypes: any;
    private countriesList: any;

    /* Tabs control */
    public tabsControl: any = [];

    /* Subscriptions from service observables. */
    private subscriptions: { [key: string]: any } = {};

    /* Constructor. */
    constructor(private userAdminService: UserAdminService,
                private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private _confirmationService: ConfirmationService,) {

        /* Default tabs. */
        this.tabsControl = [
            {
                "title": {
                    "icon": "fa-search",
                    "text": "Search"
                },
                "walletId": -1,
                "active": true
            },
            {
                "title": {
                    "icon": "fa-user",
                    "text": "Add Wallet"
                },
                "walletId": -1,
                "formControl": this.newWalletFormGroup(),
                "active": false
            }
        ];

        /* Get Countries list. */
        this.countriesList = this.userAdminService.countries;
    }

    ngAfterViewInit(): void {
        /* Get account types. */
        this.accountTypes = this.userAdminService.getAccountTypes();

        /* Get wallet types. */
        this.walletTypes = this.userAdminService.getWalletTypes();

        /* Subscribe to the wallets list. */
        this.subscriptions['walletList'] = this.walletsListOb.subscribe((list) => {
            /* Set wallet list, as an array. */
            let i; this.walletList = [];
            for ( i in list ) {
                /* Add an index to be user by the handle functions. */
                list[i].index = this.walletList.length;

                /* Add the type name. */
                list[i].walletTypeName = this.userAdminService.getWalletTypeById( list[i].walletType )[0].text;

                /* then push. */
                this.walletList.push( list[i] );
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
            newWallet:any = {};

        /* If the form is not valid, don't submit. */
        if ( ! thisTab.formControl.valid ) {
            this.showError('Please complete this form before submitting it.');
            return;
        }

        /* Start building the new wallet request object. */
        newWallet.walletName = formData.walletName;
        newWallet.walletAccount = formData.walletAccount[0].id;
        newWallet.walletType = formData.walletType[0].id;

        /* Add other fields depending on walletType. */
        if ( newWallet.walletType == "1" ) {
            /* Legal basic fields. */
            newWallet.walletUid = formData.walletUid;
            newWallet.walletLei = formData.walletLei;
            newWallet.walletWebUrl = formData.walletWebUrl;
            newWallet.walletIncDate = formData.walletIncDate;

            /* Legal corresondence. */
            newWallet.walletAddrCountry = formData.walletAddrCountry[0].text;
            newWallet.walletAddrPrefix = formData.walletAddrPrefix;
            newWallet.walletAddr1 = formData.walletAddr1;
            newWallet.walletAddr2 = formData.walletAddr2;
            newWallet.walletAddr3 = formData.walletAddr3;
            newWallet.walletAddr4 = formData.walletAddr4;
            newWallet.walletAddrPostcode = formData.walletAddrPostcode;

        } else if ( newWallet.walletType == "2" ) {
            /* Individual basic fields. */
            newWallet.aliases = formData.aliases;
            newWallet.formerName = formData.formerName;
            newWallet.idCardNum = formData.idCardNum;

            /* Individual residential address. */
            newWallet.rdaAddrCountry = formData.rdaAddrCountry[0].text;
            newWallet.rdaAddrPrefix = formData.rdaAddrPrefix;
            newWallet.rdaAddr1 = formData.rdaAddr1;
            newWallet.rdaAddr2 = formData.rdaAddr2;
            newWallet.rdaAddr3 = formData.rdaAddr3;
            newWallet.rdaAddr4 = formData.rdaAddr4;
            newWallet.rdaAddrPostcode = formData.rdaAddrPostcode;

            /* Individual corresondence address, if caSame is set, then we'll use the rda. */
            newWallet.caAddrCountry = formData.caSame ? newWallet.rdaAddrCountry : formData.caAddrCountry[0].text;
            newWallet.caAddrPrefix = formData.caSame ? newWallet.rdaAddrPrefix : formData.caAddrPrefix;
            newWallet.caAddr1 = formData.caSame ? newWallet.rdaAddr1 : formData.caAddr1;
            newWallet.caAddr2 = formData.caSame ? newWallet.rdaAddr2 : formData.caAddr2;
            newWallet.caAddr3 = formData.caSame ? newWallet.rdaAddr3 : formData.caAddr3;
            newWallet.caAddr4 = formData.caSame ? newWallet.rdaAddr4 : formData.caAddr4;
            newWallet.caAddrPostcode = formData.caSame ? newWallet.rdaAddrPostcode : formData.caAddrPostcode;

            /* Individual settlement detail. */
            newWallet.bankWalletId = formData.bankWalletId[0].id;
            newWallet.bankName = formData.bankName;
            newWallet.bankIBAN = formData.bankIBAN;
            newWallet.bankBICcode = formData.bankBICcode;
            newWallet.bankAccountName = formData.bankAccountName;
            newWallet.bankAccountNum = formData.bankAccountNum;
            newWallet.bdAddrCountry = formData.bdAddrCountry[0].text;
            newWallet.bdAddrPrefix = formData.bdAddrPrefix;
            newWallet.bdAddr1 = formData.bdAddr1;
            newWallet.bdAddr2 = formData.bdAddr2;
            newWallet.bdAddr3 = formData.bdAddr3;
            newWallet.bdAddr4 = formData.bdAddr4;
            newWallet.bdAddrPostcode = formData.bdAddrPostcode;
        }

        /* Send the creation request. */
        this.userAdminService.createNewWallet(newWallet).then((response) => {
            /* Handle response. */
            this.showSuccess('Successfully created the new wallet.');

            /* Clear the new wallet form. */
            this.clearNewWallet(1, false);
        }).catch((error) => {
            /* Show error if we failed to create the wallet. */
            this.showError('Failed to create the new wallet.');
        });

        /* Return. */
        return;
    }

    /**
     * Handle Edit Wallet
     * ----------------
     * Handles saving an edited wallet.
     *
     * @param {tabid} number - The formcontrol obbject that relates
     * to this edit form tab.
     * @return {void}
     */
    public handleEditWallet(tabid: number): void {
        /* Variables. */
        const thisTab = this.tabsControl[tabid];
        let
            formData = thisTab.formControl.value,
            editWalletData:any = {};

        /* If the form is not valid, don't submit. */
        if ( ! thisTab.formControl.valid ) {
            this.showError('Please complete this form before submitting it.');
            return;
        }

        /* Start building the updateWallet request object. */
        editWalletData.walletId = thisTab.walletId;
        editWalletData.walletName = formData.walletName;
        editWalletData.walletAccount = formData.walletAccount[0].id;
        editWalletData.walletType = formData.walletType[0].id;
        editWalletData.walletLocked = formData.walletLocked ? "0" : "1"; // inverted for the ui, so switch back.

        /* Add other fields depending on walletType. */
        if ( editWalletData.walletType == "1" ) {
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

        } else if ( editWalletData.walletType == "2" ) {
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

        /* Send the pdate request. */
        this.userAdminService.updateWallet(editWalletData).then((response) => {
            /* Handle Success. */
            this.showSuccess('Successfully updated this wallet.');
        }).catch((error) => {
            /* Handle error. */
            this.showError('Failed to update this wallet.');
            console.warn(error);
        })

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
    public getWalletById (id) {
        /* Variables. */
        let i;

        /* Loop over each wallet... */
        for ( i in this.walletList ) {
            /* ..check if this is the one wanted... */
            if ( this.walletList[i].walletId == id ) {
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
            '<span>Are you sure you want to delete \''+ this.walletList[index].walletName +'\'?</span>'
        ).subscribe((ans) => {
            /* ...if they are... */
            if (ans.resolved) {
                /* ...now send the request. */
                this.userAdminService.deleteWallet(dataToSend).then((response) => {
                    /* Close a edit tab for this wallet if it's open. */
                    for ( let i in this.tabsControl ) {
                        if ( this.tabsControl[i].walletId == dataToSend['walletId'] ) {
                            this.closeTab(i); break;
                        }
                    }

                    /* Handle success message. */
                    this.showSuccess('Successfully deleted wallet.');
                }).catch((error) => {
                    /* Handle error message. */
                    this.showError('Failed to delete wallet.');
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
                this.setTabActive(i);

                /* And return. */
                return;
            }
        }

        /* Reference the wallet. */
        const wallet = this.walletList[index];

        /* Now push the new tab object into the array. */
        this.tabsControl.push({
            "title": {
                "icon": "fa-user",
                "text": this.walletList[index].walletName
            },
            "walletId": wallet.walletId,
            "formControl": this.newWalletFormGroup(),
            "active": false // this.editFormControls
        });

        /* Variables and thisTab reference. */
        const thisTab = this.tabsControl[ this.tabsControl.length - 1 ];
        let
            walletAccount = [ { id: wallet.accountId, text: wallet.accountName } ],
            walletType = [ { id: wallet.walletType, text: wallet.walletTypeName } ],
            resolvedCountry, selectWallet;

        /* Now let's patch the core values. */
        thisTab.formControl.controls['walletName'].patchValue(wallet.walletName);
        thisTab.formControl.controls['walletAccount'].patchValue(walletAccount);
        thisTab.formControl.controls['walletLocked'].patchValue(wallet.walletLocked == 1 ? false : true); // invert for the ui.
        thisTab.formControl.controls['walletType'].patchValue(walletType);

        /* Then figure out what type we are... then patch the values needed for the forms shown.
           Wallet type legal. */
        if ( wallet.walletType == 1 ) {
            /* Patch the legal meta data into the form. */
            thisTab.formControl.controls['walletLei'].patchValue(wallet.Glei || '');
            thisTab.formControl.controls['walletUid'].patchValue(wallet.uid || '');
            thisTab.formControl.controls['walletWebUrl'].patchValue(wallet.websiteUrl || '');
            let incDate = this.formatDate(wallet.incorporationData);
            thisTab.formControl.controls['walletIncDate'].patchValue(incDate || '');

            /* Patch the legal correspondence address into the form. */
            resolvedCountry = this.userAdminService.resolveCountries([ { text: wallet.country } ]);
            thisTab.formControl.controls['walletAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['walletAddrPrefix'].patchValue(wallet.addressPrefix || '');
            thisTab.formControl.controls['walletAddr1'].patchValue(wallet.address1);
            thisTab.formControl.controls['walletAddr2'].patchValue(wallet.address2);
            thisTab.formControl.controls['walletAddr3'].patchValue(wallet.address3);
            thisTab.formControl.controls['walletAddr4'].patchValue(wallet.address4);
            thisTab.formControl.controls['walletAddrPostcode'].patchValue(wallet.postalCode);
        }
        /* Wallet type individual */
        else if ( wallet.walletType == 2 ) {
            /* Patch the individual basic information into the form. */
            thisTab.formControl.controls['aliases'].patchValue(wallet.aliases || '');
            thisTab.formControl.controls['formerName'].patchValue(wallet.formerName || '');
            thisTab.formControl.controls['idCardNum'].patchValue(wallet.idCardNum || '');

            /* Patch the residential address into the form. */
            resolvedCountry = this.userAdminService.resolveCountries([ { text: wallet.rdaCountry } ]);
            thisTab.formControl.controls['rdaAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['rdaAddrPrefix'].patchValue(wallet.rdaAddressPrefix || '');
            thisTab.formControl.controls['rdaAddr1'].patchValue(wallet.rdaAddress1 || '');
            thisTab.formControl.controls['rdaAddr2'].patchValue(wallet.rdaAddress2 || '');
            thisTab.formControl.controls['rdaAddr3'].patchValue(wallet.rdaAddress3 || '');
            thisTab.formControl.controls['rdaAddr4'].patchValue(wallet.rdaAddress4 || '');
            thisTab.formControl.controls['rdaAddrPostcode'].patchValue(wallet.rdaPostalCode || '');

            /* Patch the correspondence address into the form. */
            resolvedCountry = this.userAdminService.resolveCountries([ { text: wallet.caCountry } ]);
            thisTab.formControl.controls['caAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['caAddrPrefix'].patchValue(wallet.caAddressPrefix || '');
            thisTab.formControl.controls['caAddr1'].patchValue(wallet.caAddress1 || '');
            thisTab.formControl.controls['caAddr2'].patchValue(wallet.caAddress2 || '');
            thisTab.formControl.controls['caAddr3'].patchValue(wallet.caAddress3 || '');
            thisTab.formControl.controls['caAddr4'].patchValue(wallet.caAddress4 || '');
            thisTab.formControl.controls['caAddrPostcode'].patchValue(wallet.caPostalCode || '');

            /* Get the wallet selected by ID. */
            selectWallet = this.getWalletById( wallet.bankWalletId );
            if ( selectWallet ) {
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
            resolvedCountry = this.userAdminService.resolveCountries([ { text: wallet.bdCountry } ]);
            thisTab.formControl.controls['bdAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['bdAddrPrefix'].patchValue(wallet.bdAddressPrefix || '');
            thisTab.formControl.controls['bdAddr1'].patchValue(wallet.bdAddress1 || '');
            thisTab.formControl.controls['bdAddr2'].patchValue(wallet.bdAddress2 || '');
            thisTab.formControl.controls['bdAddr3'].patchValue(wallet.bdAddress3 || '');
            thisTab.formControl.controls['bdAddr4'].patchValue(wallet.bdAddress4 || '');
            thisTab.formControl.controls['bdAddrPostcode'].patchValue(wallet.bdPostalCode || '');
        }

        /* Lastly, activate the new tab. */
        this.setTabActive(this.tabsControl.length - 1);

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
        this.setTabActive(0);

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
    public formatDate (date:any) {
        /* Variables. */
        const dateo = new Date(date);

        /* Let's check if the date object was instantiated correctly. */
        if ( Object.prototype.toString.call(dateo) === "[object Date]" ) {
            /* Now let's check if the date object holds a valid date. */
            if ( ! isNaN(dateo.getTime()) ) {
                /* If all is good, return a nice string. */
                return dateo.getFullYear() +"-"+ this.numberPad(dateo.getMonth()) +"-"+ this.numberPad(dateo.getDate())
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
    public numberPad (num) {
        /* examples:
         * 5 -> "05"
         * 12 -> "12"
         */
        return num < 10 ? "0"+num : num.toString();
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
        /* Lets loop over all current tabs and switch them to not active. */
        this.tabsControl.map((i) => {
            i.active = false;
        });

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        /* Set the list active. */
        this.tabsControl[index].active = true;

        /* Yes, we have to call this again to get it to work, trust me... */
        this.changeDetectorRef.detectChanges();
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
        if (event) event.preventDefault();

        /* Let's set all the values in the form controls. */
        this.tabsControl[tabid].formControl = this.newWalletFormGroup();

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        /* Return. */
        return;
    }

    private newWalletFormGroup ():FormGroup {
        return new FormGroup(
            {
                /* Core wallet fields. */
                "walletName": new FormControl('',[
                    Validators.required,
                    Validators.maxLength(200)
                ]),
                "walletAccount": new FormControl([], [
                    Validators.required
                ]),
                "walletLocked": new FormControl(false, [
                    Validators.required
                ]),
                "walletType": new FormControl([], [
                    Validators.required
                ]),

                /* Legal type Fields. */
                "walletLei": new FormControl(''),
                "walletUid": new FormControl(''),
                "walletWebUrl": new FormControl(''),
                "walletIncDate": new FormControl(''),

                "walletAddrCountry": new FormControl(''),
                "walletAddrPrefix": new FormControl(''),
                "walletAddr1": new FormControl(''),
                "walletAddr2": new FormControl(''),
                "walletAddr3": new FormControl(''),
                "walletAddr4": new FormControl(''),
                "walletAddrPostcode": new FormControl(''),

                /* Individual type Fields. */
                "aliases": new FormControl([]),
                "formerName": new FormControl(''),
                "idCardNum": new FormControl(''),

                "rdaAddrCountry": new FormControl([]),
                "rdaAddrPrefix": new FormControl(''),
                "rdaAddr1": new FormControl(''),
                "rdaAddr2": new FormControl(''),
                "rdaAddr3": new FormControl(''),
                "rdaAddr4": new FormControl(''),
                "rdaAddrPostcode": new FormControl(''),

                "caSame": new FormControl(false),
                "caAddrCountry": new FormControl([]),
                "caAddrPrefix": new FormControl(''),
                "caAddr1": new FormControl(''),
                "caAddr2": new FormControl(''),
                "caAddr3": new FormControl(''),
                "caAddr4": new FormControl(''),
                "caAddrPostcode": new FormControl(''),

                "bankWalletId": new FormControl(''),
                "bankName": new FormControl(''),
                "bankIBAN": new FormControl(''),
                "bankBICcode": new FormControl(''),
                "bankAccountName": new FormControl(''),
                "bankAccountNum": new FormControl(''),

                "bdAddrCountry": new FormControl([]),
                "bdAddrPrefix": new FormControl(''),
                "bdAddr1": new FormControl(''),
                "bdAddr2": new FormControl(''),
                "bdAddr3": new FormControl(''),
                "bdAddr4": new FormControl(''),
                "bdAddrPostcode": new FormControl(''),
            }
        );
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

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (var key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }
}
