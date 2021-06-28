/* Core / Angular imports. */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/* Redux. */
import { NgRedux, select } from '@angular-redux/store';
/* Alerts and confirms. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService, immutableHelper } from '@setl/utils';
/* User Admin Service. */
import { PersistService } from '@setl/core-persist/';
import { UserAdminService } from '../useradmin.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { managedWalletsActions } from '@setl/core-store';
import { MultilingualService } from '@setl/multilingual';
import { walletFieldsModel, walletListActions, walletListFilters } from './wallets.model';

/* Decorator. */
@Component({
    selector: 'setl-admin-wallets',
    templateUrl: 'wallets.component.html',
    styleUrls: ['wallets.component.css'],
    providers: [UserAdminService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/* Class. */
export class AdminWalletsComponent implements OnInit, AfterViewInit, OnDestroy {
    /* Wallet List. */
    @select(['wallet', 'managedWallets', 'walletList']) walletsListOb;
    public walletList: any;
    public filteredWalletList: any;

    /* Tabs control */
    public tabsControl: any = [];

    /* Types lists. */
    private accountTypes: any;
    private walletTypes: any;
    private countriesList: any;

    /*  Datagrid */
    public walletFieldsModel = walletFieldsModel;
    public walletListActions = walletListActions;
    public walletListFilters = walletListFilters;

    /* Subscriptions from service observables. */
    private subscriptions: { [key: string]: any } = {};

    /* Setup datepicker */
    public configFiltersDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null,
    };

    private exisitingIncDate: string = moment().format('YYYY-MM-DD');

    /* Constructor. */
    constructor(
        private userAdminService: UserAdminService,
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertsService: AlertsService,
        private confirmationService: ConfirmationService,
        private persistService: PersistService,
        public translate: MultilingualService,
    ) {
    }

    public ngOnInit() {
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

            /* Also filter a new list for ui elements. */
            this.filteredWalletList = this.walletList.map((wallet) => {
                return {
                    id: wallet.walletId,
                    text: wallet.walletName,
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

        /* Unsubscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }

        this.ngRedux.dispatch(managedWalletsActions.setAllTabs(this.tabsControl));
    }

    /**
     * Initialises the tabs.
     *
     * @return {void}
     */
    setInitialTabs() {
        /* Get opened tabs from redux store. */
        const openedTabs = immutableHelper.get(this.ngRedux.getState(), ['wallet', 'managedWallets', 'openedTabs']);

        if (_.isEmpty(openedTabs)) {
            /* Default tabs. */
            this.tabsControl = [
                {
                    title: {
                        icon: 'fa-search',
                        text: this.translate.translate('Search'),
                    },
                    walletId: -1,
                    active: true,
                },
                /*
                {
                    title: {
                        icon: 'fa-user',
                        text: this.translate.translate('Add Wallet'),
                    },
                    walletId: -1,
                    formControl: this.newWalletFormGroup(),
                    active: false,
                },
                */
            ];

            /*
            this.tabsControl[1].formControl.controls['walletType'].valueChanges.subscribe((type) => {
                const walletType = _.get(type, '[0].id', 0);

                if (walletType === '1') {
                    // Set incorporation date to required and clear any errors if user switches wallet type
                    this.tabsControl[1].formControl.controls['walletIncDate'].setValidators([
                        Validators.required,
                        Validators.pattern('^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$'),
                    ]);
                } else {
                    this.tabsControl[1].formControl.controls['walletIncDate'].setErrors(null);
                }
            });
            */

            return true;
        }

        this.tabsControl = openedTabs;
        //this.tabsControl[1].formControl =
        //    this.persistService.watchForm('useradmin/newWallet', this.tabsControl[1].formControl);
    }

    /**
     * Saves a new wallet.
     *
     * @param {number} tabId - The ID of the tab that contains the save formControl.
     *
     * @return {void}
     */
    public handleNewWallet(tabId: number): void {
        /* Show a loading alert */
        this.alertsService.create('loading');

        /* Variables. */
        const thisTab = this.tabsControl[tabId];
        const formData = thisTab.formControl.value;
        const newWallet: any = {};

        /* If the form is not valid, don't submit. */
        if (!thisTab.formControl.valid) {
            this.alertsService.generate(
                'error',
                this.translate.translate('Please complete this form before submitting it.'),
            );
            return;
        }

        /* Start building the new wallet request object. */
        newWallet.walletName = formData.walletName;
        newWallet.walletAccount = formData.walletAccount[0].id;
        newWallet.walletType = formData.walletType[0].id;

        /* Add other fields depending on walletType. */
        if (newWallet.walletType === '1') {
            const walletAddrCountry = (formData.walletAddrCountry.length > 0) ? formData.walletAddrCountry[0].text : '';
            const formattedDate = moment().format('YYYY-MM-DD');

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
            newWallet.aliases = formData.aliases;
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
            this.alertsService.generate(
                'success',
                this.translate.translate('Successfully created the new wallet.'),
            );
        })
        .catch(() => {
            /* Show error if we failed to create the wallet. */
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to create the new wallet.'),
            );
        });

        /* Clear new wallet form. */
        this.clearNewWallet(1, false);
    }

    /**
     * Handles clicks on datagrid action buttons
     * @param tabId
     */
    onAction(action) {
        if (action.type === 'editWallet') this.handleEdit(action.data.index);
        //if (action.type === 'deleteWallet') this.handleDelete(action.data.index);
    }

    /**
     * Updates a wallet.
     *
     * @param {number} tabId - The ID of the tab containting the edit formControl.
     *
     * @return {void}
     */
    public handleEditWallet(tabId: number): void {
        /* Show a loading alert */
        this.alertsService.create('loading');

        /* Variables. */
        const thisTab = this.tabsControl[tabId];
        const formData = thisTab.formControl.value;
        const editWalletData: any = {};

        /* If the form is not valid, don't submit. */
        if (!thisTab.formControl.valid) {
            this.alertsService.generate(
                'error',
                this.translate.translate('Please complete this form before submitting it.'),
            );
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
            editWalletData.walletIncDate = formData.walletIncDate || this.exisitingIncDate;

            /* Legal corresondence. */
            editWalletData.walletAddrCountry = formData.walletAddrCountry.length > 0
                ? formData.walletAddrCountry[0].text : null;
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
            editWalletData.rdaAddrCountry = formData.rdaAddrCountry.length > 0 ? formData.rdaAddrCountry[0].text : null;
            editWalletData.rdaAddrPrefix = formData.rdaAddrPrefix;
            editWalletData.rdaAddr1 = formData.rdaAddr1;
            editWalletData.rdaAddr2 = formData.rdaAddr2;
            editWalletData.rdaAddr3 = formData.rdaAddr3;
            editWalletData.rdaAddr4 = formData.rdaAddr4;
            editWalletData.rdaAddrPostcode = formData.rdaAddrPostcode;

            /* Individual corresondence address. */
            editWalletData.caAddrCountry = formData.caAddrCountry.length > 0 ? formData.caAddrCountry[0].text : null;
            editWalletData.caAddrPrefix = formData.caAddrPrefix;
            editWalletData.caAddr1 = formData.caAddr1;
            editWalletData.caAddr2 = formData.caAddr2;
            editWalletData.caAddr3 = formData.caAddr3;
            editWalletData.caAddr4 = formData.caAddr4;
            editWalletData.caAddrPostcode = formData.caAddrPostcode;

            /* Individual settlement detail. */
            editWalletData.bankWalletId = formData.bankWalletId.length > 0 ? formData.bankWalletId[0].id : null;
            editWalletData.bankName = formData.bankName;
            editWalletData.bankIBAN = formData.bankIBAN;
            editWalletData.bankBICcode = formData.bankBICcode;
            editWalletData.bankAccountName = formData.bankAccountName;
            editWalletData.bankAccountNum = formData.bankAccountNum;
            /* settlement address */
            editWalletData.bdAddrCountry = formData.bdAddrCountry.length > 0 ? formData.bdAddrCountry[0].text : null;
            editWalletData.bdAddrPrefix = formData.bdAddrPrefix;
            editWalletData.bdAddr1 = formData.bdAddr1;
            editWalletData.bdAddr2 = formData.bdAddr2;
            editWalletData.bdAddr3 = formData.bdAddr3;
            editWalletData.bdAddr4 = formData.bdAddr4;
            editWalletData.bdAddrPostcode = formData.bdAddrPostcode;
        }

        /* Send the Update request. */
        this.userAdminService.updateWallet(editWalletData).then((response) => {
            let updatedWallet: any = '';
            if (response[1].Data[0]) {
                updatedWallet = response[1].Data[0];
            }
            // TODO Update Wallet Locked status
            /* Handle Success. */
            this.alertsService.generate(
                'success',
                this.translate.translate('Successfully updated this wallet.'),
            );
            const currWalletIndex = _.findIndex(this.walletList, { walletId: updatedWallet.walletID });
            this.walletList[currWalletIndex].walletName = updatedWallet.walletName;
            this.walletList[currWalletIndex].walletLocked = updatedWallet.walletLocked;
        }).catch((error) => {
            /* Handle error. */
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to update this wallet.'),
            );
            console.warn(error);
        });

        return;
    }

    /**
     * Gets a wallet by ID.
     *
     * @param {number} id - The ID of the wallet.
     *
     * @return {Object|Boolean} - The wallet object or false.
     */
    public getWalletById(id) {
        /* Variables. */
        let i;

        /* Loop over each wallet... */
        for (i in this.walletList) {
            /* ..check if this is the one wanted... */
            if (this.walletList[i].walletId === Number(id)) {
                /* ...return if so. */
                return this.walletList[i];
            }
        }

        /* If we get here, there was no wallet, so return false. */
        return false;
    }

    /**
     * Deletes a wallet.
     *
     * @param {number} index - The index of a wallet to be edited.
     *
     * @return {void}
     */
    /*
    public handleDelete(index): void {
        // Get the wallet's ID.
        const dataToSend = {};
        dataToSend['walletId'] = this.walletList[index].walletId;

        // Let's now ask the user if they're sure...
        this.confirmationService.create(
            `<span>${this.translate.translate('Deleting a Wallet')}</span>`,
            `<span class="text-warning">${this.translate.translate(
                'Are you sure you want to delete @walletName@?',
                { walletName: this.walletList[index].walletName },
            )}</span>`,
        ).subscribe((ans) => {
            // ...if they are...
            if (ans.resolved) {
                // ...now send the request.
                this.userAdminService.deleteWallet(dataToSend).then((response) => {
                    // Close a edit tab for this wallet if it's open.
                    for (const i in this.tabsControl) {
                        if (this.tabsControl[i].walletId === dataToSend['walletId']) {
                            this.closeTab(i);
                            break;
                        }
                    }

                    // Handle success message.
                    this.alertsService.generate(
                        'success',
                        this.translate.translate('Successfully deleted wallet.'),
                    );
                }).catch((error) => {
                    // Handle error message.
                    this.alertsService.generate(
                        'error',
                        this.translate.translate('Failed to delete wallet.'),
                    );
                    console.warn(error);
                });
            }
        });

        return;
    }
    */

    /**
     * Handles the editting of a wallet.
     *
     * @param {number} index - The index of the wallet to be edited.
     *
     * @return {void}
     */
    public handleEdit(index): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i += 1) {
            if (this.tabsControl[i].walletId === this.walletList[index].walletId) {
                /* Found the index for that tab, lets activate it... */
                // this.setTabActive(i);
                this.router.navigateByUrl(`/user-administration/wallets/${i}`);

                return;
            }
        }

        /* Reference the wallet. */
        const wallet = this.walletList[index];

        /* Now push the new tab object into the array. */
        this.tabsControl.push({
            title: {
                icon: 'fa-user',
                text: this.walletList[index].walletName,
            },
            walletId: wallet.walletId,
            formControl: this.newWalletFormGroup('edit'),
            active: false, // this.editFormControls
        });

        /* Variables and thisTab reference. */
        const thisTab = this.tabsControl[this.tabsControl.length - 1];
        const walletAccount = [{ id: wallet.accountId, text: wallet.accountName }];
        const walletType = [{ id: String(wallet.walletType), text: wallet.walletTypeName }];
        let resolvedCountry;
        let selectWallet;

        /* Now let's patch the core values. */
        thisTab.formControl.controls['walletName'].patchValue(wallet.walletName);
        thisTab.formControl.controls['walletAccount'].patchValue(walletAccount);
        thisTab.formControl.controls['walletLocked'].patchValue(wallet.walletLocked === 0 ? false : true);
        thisTab.formControl.controls['walletType'].patchValue(walletType);

        /* Set/remove validator on legal type selected */
        thisTab.formControl.controls['walletType'].valueChanges.subscribe((type) => {
            const walletType = _.get(type, '[0].id', 0);

            if (walletType !== '1') {
                thisTab.formControl.controls['walletIncDate'].setErrors(null);
            } else {
                thisTab.formControl.controls['walletIncDate'].setValidators([
                    Validators.required,
                    Validators.pattern('^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$'),
                ]);
            }
        });

        /* Then figure out what type we are... then patch the values needed for the forms shown. */

        /* Wallet type legal. */
        if (wallet.walletType === 1) {
            /* Patch the legal meta data into the form. */
            thisTab.formControl.controls['walletLei'].patchValue(wallet.Glei || '');
            thisTab.formControl.controls['walletUid'].patchValue(wallet.uid || '');
            thisTab.formControl.controls['walletWebUrl'].patchValue(wallet.websiteUrl || '');
            this.exisitingIncDate = wallet.incorporationData ?
                moment(wallet.incorporationData).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            thisTab.formControl.controls['walletIncDate'].patchValue(this.exisitingIncDate);

            /* Patch the legal correspondence address into the form. */
            resolvedCountry = this.userAdminService.resolveCountries([{ text: wallet.country }]);
            thisTab.formControl.controls['walletAddrCountry'].patchValue(resolvedCountry);
            thisTab.formControl.controls['walletAddrPrefix'].patchValue(wallet.addressPrefix || '');
            thisTab.formControl.controls['walletAddr1'].patchValue(wallet.address1);
            thisTab.formControl.controls['walletAddr2'].patchValue(wallet.address2);
            thisTab.formControl.controls['walletAddr3'].patchValue(wallet.address3);
            thisTab.formControl.controls['walletAddr4'].patchValue(wallet.address4);
            thisTab.formControl.controls['walletAddrPostcode'].patchValue(wallet.postalCode);

            /* Set incorporation date to required and clear any errors if user switches wallet type */
            thisTab.formControl.controls['walletIncDate'].setValidators([
                Validators.required,
                Validators.pattern('^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$'),
            ]);

            /* Wallet type individual */
        } else if (wallet.walletType === 2) {
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
                    text: selectWallet.walletName,
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
        this.router.navigateByUrl(`/user-administration/wallets/${newTabId}`);

        /* Clear the new wallet form */
        //this.clearNewWallet(1, false);

        return;
    }

    /**
     * Removes a tab from the tabsControl array, in effect, closing it.
     *
     * @param {number} index - The index of the tab to close.
     *
     * @return {void}
     */
    public closeTab(index) {
        /* Validate that we have index. */
        if (!index && index !== 0) {
            return;
        }

        /* Remove the object from the tabsControl array. */
        this.tabsControl = [
            ...this.tabsControl.slice(0, index),
            ...this.tabsControl.slice(index + 1, this.tabsControl.length),
        ];

        /* Reset tabs. */
        this.router.navigateByUrl('/user-administration/wallets/0');

        return;
    }

    /**
     * Sets all tabs to inactive other than the given index.
     * This means the view is switched to the wanted tab.
     *
     * @param {number} index - The index of the tab to close.
     *
     * @return {void}
     */
    public setTabActive(index: number = 0) {
        this.tabsControl = immutableHelper.map(this.tabsControl, (item, thisIndex) => {
            return item.set('active', thisIndex === Number(index));
        });
    }

    /**
     * Clears the new user form, i.e., clears all input values.
     *
     * @param {number} tabId - The ID of the tab containing the form to clear (will always be 1).
     *
     * @return {void}
     */
    public clearNewWallet(tabId, event): void {
        /* Prevent submit. */
        if (event) {
            event.preventDefault();
        }

        /* Let's set all the values in the form controls. */
        this.tabsControl[tabId].formControl =
            this.persistService.refreshState('useradmin/newWallet', this.newWalletFormGroup('clear'));

        /* Override the changes. */
        this.changeDetectorRef.markForCheck();

        return;
    }

    private newWalletFormGroup(type: string = 'new'): FormGroup {
        const group = new FormGroup(
            {
                /* Core wallet fields. */
                walletName: new FormControl('', [
                    Validators.required,
                    Validators.maxLength(200),
                ]),
                walletAccount: new FormControl([], [
                    Validators.required,
                ]),
                walletLocked: new FormControl(false),
                walletType: new FormControl([], [
                    Validators.required,
                ]),

                /* Legal type Fields. */
                walletLei: new FormControl(''),
                walletUid: new FormControl(''),
                walletWebUrl: new FormControl(''),
                walletIncDate: new FormControl(''),
                walletAddrCountry: new FormControl(''),
                walletAddrPrefix: new FormControl(''),
                walletAddr1: new FormControl(''),
                walletAddr2: new FormControl(''),
                walletAddr3: new FormControl(''),
                walletAddr4: new FormControl(''),
                walletAddrPostcode: new FormControl(''),

                /* Individual type Fields. */
                aliases: new FormControl(''),
                formerName: new FormControl(''),
                idCardNum: new FormControl(''),

                rdaAddrCountry: new FormControl([]),
                rdaAddrPrefix: new FormControl(''),
                rdaAddr1: new FormControl(''),
                rdaAddr2: new FormControl(''),
                rdaAddr3: new FormControl(''),
                rdaAddr4: new FormControl(''),
                rdaAddrPostcode: new FormControl(''),

                caSame: new FormControl(false),
                caAddrCountry: new FormControl([]),
                caAddrPrefix: new FormControl(''),
                caAddr1: new FormControl(''),
                caAddr2: new FormControl(''),
                caAddr3: new FormControl(''),
                caAddr4: new FormControl(''),
                caAddrPostcode: new FormControl(''),

                bankWalletId: new FormControl(''),
                bankName: new FormControl(''),
                bankIBAN: new FormControl(''),
                bankBICcode: new FormControl(''),
                bankAccountName: new FormControl(''),
                bankAccountNum: new FormControl(''),

                bdAddrCountry: new FormControl([]),
                bdAddrPrefix: new FormControl(''),
                bdAddr1: new FormControl(''),
                bdAddr2: new FormControl(''),
                bdAddr3: new FormControl(''),
                bdAddr4: new FormControl(''),
                bdAddrPostcode: new FormControl(''),
            },
        );

        /* Return the form group and watch it using the persistService. */
        if (type === 'new') {
            return this.persistService.watchForm('useradmin/newWallet', group);
        }

        return group;
    }
}
