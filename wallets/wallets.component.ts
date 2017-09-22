/* Core imports. */
import {Component, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {FormsModule, FormGroup, FormControl, NgModel} from '@angular/forms';

import {OnDestroy} from '@angular/core';

import {select, NgRedux} from '@angular-redux/store';

import {AlertsService} from '@setl/jaspero-ng2-alerts';

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
                private alertsService: AlertsService,) {

        /* Default tabs. */
        this.tabsControl = [
            {
                "title": "<i class='fa fa-search'></i> Search",
                "walletId": -1,
                "active": true
            },
            {
                "title": "<i class='fa fa-user'></i> Add Wallet",
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

            console.log( this.walletList );

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

        /* Proccess the data. */
        newWallet.walletName = formData.walletName;

        /* Clear the form. */
        this.clearNewWallet(1, false);

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
        const thisTab = this.tabsControl[tabid];

        /* Sort the data structure out. */
        let formData = thisTab.formControl.value;

        /* Return */
        return;
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
        /* Get the user's data. */
        let dataToSend = {};


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

        /* Fix up some data. */
        const wallet = this.walletList[index];

        /* Then push the new tab object into the array. */
        this.tabsControl.push({
            "title": "<i class='fa fa-user'></i> " + this.walletList[index].walletName,
            "walletId": wallet.walletId,
            "formControl": this.newWalletFormGroup(),
            "active": false // this.editFormControls
        });

        /* Variables. */
        const thisTab = this.tabsControl[ this.tabsControl.length - 1 ];
        let
            walletAccount = [ { id: wallet.accountId, text: wallet.accountName } ],
            walletType = [ { id: wallet.walletType, text: wallet.walletTypeName } ];

        /* Now let's patch the core values. */
        thisTab.formControl.controls['walletName'].patchValue(wallet.walletName);
        thisTab.formControl.controls['walletAccount'].patchValue(walletAccount);
        thisTab.formControl.controls['walletLocked'].patchValue(!wallet.walletLocked);
        thisTab.formControl.controls['walletType'].patchValue(walletType);

        /* Then figure out what type we are... then patch the values needed for the forms shown.
        Wallet type legal. */
        let resolvedCountry
        if ( wallet.walletType == 1 ) {
            thisTab.formControl.controls['walletLei'].patchValue(wallet.Glei || '');
            thisTab.formControl.controls['walletUid'].patchValue(wallet.uid || '');
            thisTab.formControl.controls['walletWebUrl'].patchValue(wallet.websiteUrl || '');
            thisTab.formControl.controls['walletIncDate'].patchValue(wallet.incorporationData || '');
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
            thisTab.formControl.controls['aliases'].patchValue(wallet.aliases || '');
            thisTab.formControl.controls['formerName'].patchValue(wallet.formerName || '');
            thisTab.formControl.controls['idCardNum'].patchValue(wallet.idCardNum || '');

            resolvedCountry = this.userAdminService.resolveCountries([ { text: wallet.rdaCountry } ]);
            thisTab.formControl.controls['rdaAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['rdaAddrPrefix'].patchValue(wallet.rdaAdressPrefix || '');
            thisTab.formControl.controls['rdaAddr1'].patchValue(wallet.rdaAddress1 || '');
            thisTab.formControl.controls['rdaAddr2'].patchValue(wallet.rdaAddress2 || '');
            thisTab.formControl.controls['rdaAddr3'].patchValue(wallet.rdaAddress3 || '');
            thisTab.formControl.controls['rdaAddr4'].patchValue(wallet.rdaAddress4 || '');
            thisTab.formControl.controls['rdaAddrPostcode'].patchValue(wallet.rdaPostalCode || '');

            // thisTab.formControl.controls['caSame'].patchValue();
            resolvedCountry = this.userAdminService.resolveCountries([ { text: wallet.caAddressCountry } ]);
            thisTab.formControl.controls['caAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['caAddrPrefix'].patchValue(wallet.caAddressPrefix || '');
            thisTab.formControl.controls['caAddr1'].patchValue(wallet.caAddress1 || '');
            thisTab.formControl.controls['caAddr2'].patchValue(wallet.caAddress2 || '');
            thisTab.formControl.controls['caAddr3'].patchValue(wallet.caAddress3 || '');
            thisTab.formControl.controls['caAddr4'].patchValue(wallet.caAddress4 || '');
            thisTab.formControl.controls['caAddrPostcode'].patchValue(wallet.caPostalCode || '');

            thisTab.formControl.controls['bankWalletId'].patchValue(wallet.bankWalletId || '');
            thisTab.formControl.controls['bankName'].patchValue(wallet.bankName || '');
            thisTab.formControl.controls['bankIBAN'].patchValue(wallet.bankIBAN || '');
            thisTab.formControl.controls['bankBICcode'].patchValue(wallet.bankBicCode || '');
            thisTab.formControl.controls['bankAccountName'].patchValue(wallet.bankAccountName || '');
            thisTab.formControl.controls['bankAccountNum'].patchValue(wallet.bankAccountNum || '');

            resolvedCountry = this.userAdminService.resolveCountries([ { text: wallet.bdAddressCountry } ]);
            thisTab.formControl.controls['bdAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['bdAddrPrefix'].patchValue(wallet.bdAddressPrefix || '');
            thisTab.formControl.controls['bdAddr1'].patchValue(wallet.bdAddress1 || '');
            thisTab.formControl.controls['bdAddr2'].patchValue(wallet.bdAddress2 || '');
            thisTab.formControl.controls['bdAddr3'].patchValue(wallet.bdAddress3 || '');
            thisTab.formControl.controls['bdAddr4'].patchValue(wallet.bdAddress4 || '');
            thisTab.formControl.controls['bdAddrPostcode'].patchValue(wallet.bdPostalCode || '');
        }

        /* Activate the new tab. */
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
                "walletName": new FormControl(''),
                "walletAccount": new FormControl([]),
                "walletLocked": new FormControl(false),
                "walletType": new FormControl([]),

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
