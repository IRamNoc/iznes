/* Core imports. */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild }
    from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MultilingualService } from '@setl/multilingual';

/* Alerts and confirms. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ConfirmationService, immutableHelper, SagaHelper } from '@setl/utils';

/* User Admin Service. */
import { UserAdminService } from '../useradmin.service';
import { Subscription } from 'rxjs/Subscription';
import { userAdminActions } from '@setl/core-store';
import { AdminUsersService } from '@setl/core-req-services';
import { LogService } from '@setl/utils';
import { ClrDatagridStateInterface } from '@clr/angular';
import { MyUserService } from '@setl/core-req-services';
import { usersListActions, usersListFields } from './users.model';
import { actionChannel } from 'redux-saga/effects';

/* Decorator. */
@Component({
    selector: 'setl-admin-users',
    templateUrl: 'users.component.html',
    styleUrls: ['users.component.css'],
    providers: [UserAdminService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/* Class. */
export class AdminUsersComponent implements OnInit, AfterViewInit, OnDestroy {
    /* Users data grid */
    @ViewChild('usersDataGrid') usersDataGrid;

    /* User data. */
    public usersList: any = [];
    public paginatedUsersList: any;
    public myDetail: any;
    private language: string;

    /* Tabs control */
    public tabsControl: any = [];

    /* Account types select. */
    public accountTypes: any;
    private allGroupList: any;
    private usersPermissionsList: any;
    private usersWalletPermissions: any;
    private usersChainAccess: any;

    /* User types select. */
    public userTypes: any;

    /* Subscriptions from service observables. */
    private subscriptions: { [key: string]: Subscription } = {};

    /* Filtered groups list. */
    public filteredAdminGroupsList = [];
    public filteredTxGroupsList = [];
    public filteredMenuGroupsList = [];

    /* Chain and Wallet Lists  */
    public chainList: { [chainId: number]: { chainId: number | string, chainName: string } } = {};
    public filteredChainList: { id: number | string, text: string }[] = [];
    public selectedChainItem: any = [];
    private manageWalletList: any;

    /* Datagrid and pagination */
    public dgTotalItems: number = 0;
    public dgPageFrom: number = 0;
    public dgPageSize: number = 10;
    public currentPage: number = 1;
    public usersListModel: {} = usersListFields;
    public usersListActions: {}[] = usersListActions;

    /* User list cache */
    private totalRecords: number = 0;

    /* Search user */
    public search: string = '';
    private searchedUsersList: any = [];

    /* Default wallet */
    public hasDefaultWallet: boolean = false;

    /* Redux observables */
    @select(['userAdmin', 'chains', 'chainList']) chainListObservable;
    @select(['userAdmin', 'chain', 'requestedChainList']) requestedChainListOb;
    @select(['user', 'myDetail']) myDetailOb;
    @select(['wallet', 'managedWallets', 'walletList']) manageWalletsListOb;
    @select(['userAdmin', 'users', 'openedTabs']) openTabsOb;
    @select(['userAdmin', 'users', 'usersList']) usersListOb;
    @select(['userAdmin', 'users', 'totalRecords']) totalRecordsOb;
    @select(['user', 'siteSettings', 'language']) requestLanguageOb;

    /* Constructor. */
    constructor(private userAdminService: UserAdminService,
                private adminUserService: AdminUsersService,
                private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private logService: LogService,
                private confirmationService: ConfirmationService,
                private myUserService: MyUserService,
                public translate: MultilingualService,
    ) {
        this.subscriptions['language'] = this.requestLanguageOb.subscribe((lang) => {
            if (lang) this.language = lang;
        });
    }

    onAction(action) {
        if (action.type === 'editUser') this.handleEdit(action.data.userID);
        if (action.type === 'deleteUser') this.handleDelete(action.data.userID);
    }

    setInitialTabs() {
        /* Get opened tabs from redux store. */
        const openedTabs = immutableHelper.get(this.ngRedux.getState(), ['userAdmin', 'users', 'openedTabs']);

        if (_.isEmpty(openedTabs)) {
            /* Default tabs. */
            this.tabsControl = [
                {
                    title: {
                        icon: 'fa-search',
                        text: this.translate.translate('Search'),
                    },
                    userId: -1,
                    active: true,
                },
                {
                    title: {
                        icon: 'fa-user',
                        text: this.translate.translate('Add User'),
                    },
                    userId: -1,
                    formControl: this.getNewUserFormGroup(),
                    selectedChain: 0,
                    filteredTxList: [], // filtered groups of this chainid.
                    selectedTxList: [], // groups to show as selected.
                    allocatedTxList: [], // all groups assigned to the user.
                    selectedMenuList: [], // groups to show as selected.
                    filteredWalletsByAccount: [], // filtered wallets by account.
                    oldChainAccess: {},
                    active: false,
                },
            ];
            return true;
        }

        /* Recover tabs, and then re-init persist. */
        this.tabsControl = openedTabs;
    }

    ngOnInit() {
        /* Get totalRecords to build datagrid pagination */
        this.subscriptions['totalRecords'] = this.totalRecordsOb.subscribe((totalRecords) => {
            this.totalRecords = totalRecords;
            this.dgTotalItems = totalRecords;
            this.changeDetectorRef.detectChanges();
            this.requestPaginatedUsersList();
        });

        /* Get Account Types. */
        this.accountTypes = this.userAdminService.getAccountTypes();

        /* Get User Types. */
        this.userTypes = this.userAdminService.getUserTypes();

        /* Subscribe to the admin user list observable. */
        this.subscriptions['userListSubscription'] = this.usersListOb.subscribe((list) => {
            this.usersList = this.convertUsersListToArray(list);

            this.setPaginatedUsersList();

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Subscribe to the admin group list observable. */
        this.subscriptions['allGroupList'] = this.userAdminService.getGroupListSubject().subscribe((list) => {
            /* Set raw list. */
            this.allGroupList = this.convertGroupsToArray(list);

            /* Filter the list. */
            this.filterGroupLists();

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Subscribe to the user permissions list observable. */
        this.subscriptions['usersPermissionsList'] =
            this.userAdminService.getUsersPermissionsListSubject().subscribe((list) => {
                /* Set raw list. */
                this.usersPermissionsList = list;

                /* Override the changes. */
                this.changeDetectorRef.detectChanges();
            });

        /* Subscribe to the user wallet permissions observable. */
        this.subscriptions['usersWalletPermissions'] =
            this.userAdminService.getUsersWalletPermissionsSubject().subscribe((list) => {
                /* Set raw list. */
                this.usersWalletPermissions = list;

                /* Override the changes. */
                this.changeDetectorRef.detectChanges();
            });

        /* Subscribe to the user wallet permissions observable. */
        this.subscriptions['usersChainAccess'] =
            this.userAdminService.getUsersChainAccessSubject().subscribe((list) => {
                /* Set raw list. */
                this.usersChainAccess = list;

                /* Override the changes. */
                this.changeDetectorRef.detectChanges();
            });

        this.setInitialTabs();

        this.subscriptions['routeParam'] = this.route.params.subscribe((params: Params) => {
            const tabId = _.get(params, 'tabid', 0);
            this.setTabActive(tabId);

            /* If tab is a user tab (i.e. not 'Search' (0) or 'Add User' (1)) then... */
            if (Number(tabId) > 1) {
                const accountType = this.tabsControl[tabId].formControl.value.accountType[0];
                /* ...update the wallets available to the user using their account type. */
                this.setFormAccountId(tabId, accountType);

                // Set default wallet ID for user
                if (this.tabsControl[tabId]) this.hasDefaultWallet = !!this.tabsControl[tabId].defaultWalletID;
            }

            /* If tab is 'Add User', set the chain Id on a tab object. */
            if (Number(tabId) === 1 && this.filteredChainList.length) {
                this.setFormChainId(Number(tabId), this.filteredChainList[0]);
                this.hasDefaultWallet = false;
            }
        });
    }

    ngAfterViewInit(): void {
        this.subscriptions['chainList'] = this.chainListObservable.subscribe((chainList) => {
            /* Variables. */
            let chainId;

            /* Update chain list. */
            this.chainList = chainList;

            /* Update the filtered list. */
            this.filteredChainList = [];
            for (chainId in chainList) {
                if (chainId) {
                    this.filteredChainList.push({
                        id: chainId,
                        text: chainList[chainId].chainName,
                    });
                }
            }

            if (this.filteredChainList.length) {
                this.selectedChainItem.push({ id: this.filteredChainList[0].id, text: this.filteredChainList[0].text });
            }
        });

        this.subscriptions['requestedChainList'] = this.requestedChainListOb.subscribe((requestedState) => {
            /* Check if we should get the list. */
            if (!requestedState) {
                this.userAdminService.requestChainList();
            }
        });

        /* Subscribe to the my detail observable. */
        this.subscriptions['myDetail'] = this.myDetailOb.subscribe((myDetail) => {
            /* Set raw list. */
            this.myDetail = myDetail;

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Subscribe to the wallets list. */
        this.subscriptions['manageWalletList'] = this.manageWalletsListOb.subscribe((manageWalletList) => {
            /* Set raw list. */
            this.manageWalletList = manageWalletList;

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        /* Ask for update from the service above. */
        this.userAdminService.updateState();
    }

    /**
     * Datagrid Refresh
     * ----------------
     * Set the dgPageFrom and dgPageSize variables needed to set the pagninatedUsersList
     *
     * @param dataGridState
     */
    datagridRefresh(dataGridState: ClrDatagridStateInterface) {
        if (dataGridState.page) {
            this.dgPageFrom = dataGridState.page.from;
            this.dgPageSize = dataGridState.page.size;
            this.requestPaginatedUsersList();
            this.setPaginatedUsersList();
        }
    }

    /**
     * Get Paginated Users List
     * ------------------------
     *  Set the paginatedUsersList based on the current page of the datagrid
     */
    setPaginatedUsersList() {
        if (this.search && !this.searchedUsersList.length) return;

        if (this.searchedUsersList.length) {
            this.paginatedUsersList =
                this.searchedUsersList.slice(this.dgPageFrom, this.dgPageFrom + this.dgPageSize);
        } else {
            this.paginatedUsersList = this.usersList.slice(this.dgPageFrom, this.dgPageFrom + this.dgPageSize);
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Request Paginated Users List
     * ----------------------------
     * Request the next page of user data if we don't already have it
     */
    requestPaginatedUsersList() {
        if (this.usersList.length < this.totalRecords) {
            const currentPage = (this.dgPageFrom + this.dgPageSize) / this.dgPageSize;
            const pagesGot = Math.floor((this.usersList.length / this.dgPageSize));

            if (currentPage > pagesGot) {
                this.userAdminService.updateUsersStore(
                    pagesGot * this.dgPageSize,
                    (currentPage - pagesGot) * this.dgPageSize,
                );
            }
        }
    }

    /**
     * Update User List
     * ----------------
     * Updates the user list grid
     *
     * @return {void}
     */
    public updateUserList(callback: () => void): void {
        this.userAdminService.updateUsersStore();

        callback();
    }

    /**
     * Set Form Chain Id
     * -----------------
     * Sets the chain Id on a tab object, to be used by the tab forms.
     *
     * @param  {tabid} number - The tab id to be set.
     * @param  {data} object - The event object that ng2 select gives off.
     *
     * @return {void}
     */
    public setFormChainId(tabid, data): void {
        const thisTab = this.tabsControl[tabid];

        /* Ok, first, lets save the chainId that is selcted. */
        const selectedChainId = thisTab['selectedChain'] = data.id;

        /* Now let's filter the groups list to just groups assigned to this chain. */
        const groupsOfThisChain = this.allGroupList.filter((group) => {
            /* Check if group is tx. */
            if (Number(group.groupIsTx) === 1) {
                /* If we're admin, ignore chainId... */
                if (Number(this.myDetail.admin) === 1) return true;
                /* ...else check if the group belongs to this one. */
                return group.chainId === Number(selectedChainId);
            }

            /* ...if not, axe it. */
            return false;
        }).map((group) => {
            /* Then we'll map them into a nicer array of objects ng2-select. */
            return {
                id: group.groupId,
                text: group.groupName,
            };
        });

        /* Let's set that nice filtered list to the bound property for the list. */
        thisTab.filteredTxList = groupsOfThisChain;

        /* Now let's get the list of groups this user is in and filter them against
         the groups we have in this chain's filtered list. */
        const allocatedTxList = this.tabsControl[tabid].allocatedTxList;

        const filteredAllocatedGroups = groupsOfThisChain.filter((group) => {
            /* loop over each group they're in and check if it's in this chain... */
            for (const i in allocatedTxList) {
                if (allocatedTxList[i].id === group.id) {
                    return true;
                }
            }

            /* ...else return negative. */
            return false;
        });

        /* Now set the selected groups to the allocated groups filtered by this chain. */
        thisTab.formControl.controls['txGroups'].patchValue(filteredAllocatedGroups);

        /* Return. */
        return;
    }

    /**
     * Set Form Account Id
     * -------------------
     * Sets the account Id on a tab object, to be used by the tab forms.
     *
     * @param  {tabid} number - The tab id to be set.
     * @param  {data} object - The event object that ng2 select gives off.
     *
     * @return {void}
     */
    public setFormAccountId(tabid, data): void {
        const thisTab = this.tabsControl[tabid];
        /* Ok, first, lets save the account Id that is selected. */
        const selectedAccount = thisTab['selectedAccount'] = data;

        /* And now filter the new list to the new account. */
        const filteredWallets = [];
        for (const key in this.manageWalletList) {
            /* Check the id. */
            if (selectedAccount.text === this.manageWalletList[key].accountName) {
                /* Push if it's a match. */
                filteredWallets.push({
                    id: this.manageWalletList[key].walletId,
                    text: this.manageWalletList[key].walletName,
                });
            }
        }

        /* Now assign that to both the dropdowns. */
        thisTab['filteredWalletsByAccount'] = [...filteredWallets];

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();

        /* Return. */
        return;
    }

    /**
     * Added Wallet Selection
     * ----------------------
     * Adds a wallet selection form the opposite wallet dropdown.
     *
     * @param {fullAccess} number - A 1 is full access was changed, 0 not.
     * @param {tabid} number - the tab id that the form is in.
     * @param {data} object - the ng2 select object.
     *
     * @return {void}
     */
    public addedWalletSelection(fullAccess, tabid, data): void {
        /* Pointers. */
        const thisTab = this.tabsControl[tabid];
        const controls = thisTab.formControl.controls;

        /* So let's figure out if they've added duplicate wallets... */
        setTimeout(
            () => {
                for (const i in controls['walletsFull'].value) {
                    for (const j in controls['walletsRead'].value) {
                        /* If we have a duplicate wallet... */
                        if (controls['walletsRead'].value[j] !==
                            undefined && controls['walletsFull'].value[i] !== undefined) {
                            if (controls['walletsRead'].value[j].id === controls['walletsFull'].value[i].id) {
                                /* ...then we should remove it from the other select and tell the user. */
                                if (fullAccess) {
                                    delete controls['walletsRead'].value[j];
                                    controls['walletsRead'].patchValue(
                                        controls['walletsRead'].value.filter(thing => !!thing),
                                    );
                                    this.alertsService.generate(
                                        'warning',
                                        `${this.translate.translate(
                                            'You changed access to @wallet@.',
                                            { wallet: controls['walletsFull'].value[i].text })}
                                            <br><br><b>${this.translate.translate('Read access')}
                                            </b> <i class="fa fa-arrow-right"></i>
                                            <b>${this.translate.translate('Full access')}</b>.`,
                                        );
                                } else {
                                    delete controls['walletsFull'].value[i];
                                    controls['walletsFull'].patchValue(
                                        controls['walletsFull'].value.filter(thing => !!thing),
                                    );

                                    this.alertsService.generate(
                                        'warning',
                                        `${this.translate.translate(
                                            'You changed access to @wallet@.',
                                            { wallet: controls['walletsRead'].value[j].text })}
                                            <br><br><b>${this.translate.translate('Full access')}
                                            </b> <i class="fa fa-arrow-right"></i>
                                            <b>${this.translate.translate('Read access')}</b>.`,
                                        );
                                }
                            }
                        }
                    }
                }
            },
            50,
        );
    }

    /**
     * Added group Wallet Selection
     * ----------------------------
     * Adds a group wallet selection form the opposite wallet dropdown.
     *
     * @param {fullAccess} number - A 1 is full access was changed, 0 not.
     * @param {tabid} number - the tab id that the form is in.
     * @param {data} object - the ng2 select object.
     *
     * @return {void}
     */
    public addedGroupWalletSelection(fullAccess, tabid, data): void {
        /* Pointers. */
        const thisTab = this.tabsControl[tabid];
        const controls = thisTab.formControl.controls;

        /* So let's figure out if they've added duplicate wallets... */
        setTimeout(
            () => {
                for (const i in controls['groupWalletsFull'].value) {
                    for (const j in controls['groupWalletsRead'].value) {
                        /* If we have a duplicate wallet... */
                        if (controls['groupWalletsRead'].value[j] !== undefined && controls['groupWalletsFull'].value[i]
                            !== undefined) {
                            if (controls['groupWalletsRead'].value[j].id === controls['groupWalletsFull'].value[i].id) {
                                /* ...then we should remove it from the other select and tell the user. */
                                if (fullAccess) {
                                    delete controls['groupWalletsRead'].value[j];
                                    controls['groupWalletsRead'].patchValue(
                                        controls['groupWalletsRead'].value.filter(thing => !!thing),
                                    );
                                    this.alertsService.generate(
                                        'warning',
                                        `${this.translate.translate(
                                            'You changed access to @wallet@.',
                                            { wallet: controls['groupWalletsFull'].value[i].text })}
                                            <br><br><b>${this.translate.translate('Read access')}
                                            </b> <i class="fa fa-arrow-right"></i>
                                            <b>${this.translate.translate('Full access')}</b>.`,
                                        );
                                } else {
                                    delete controls['groupWalletsFull'].value[i];
                                    controls['groupWalletsFull'].patchValue(
                                        controls['groupWalletsFull'].value.filter(thing => !!thing),
                                    );

                                    this.alertsService.generate(
                                        'warning',
                                        `${this.translate.translate(
                                            'You changed access to @wallet@.',
                                            { wallet: controls['groupWalletsRead'].value[j].text })}
                                            <br><br><b>${this.translate.translate('Full access')}
                                            </b> <i class="fa fa-arrow-right"></i>
                                            <b>${this.translate.translate('Read access')}</b>.`,
                                        );
                                }
                            }
                        }
                    }
                }
            },
            50,
        );

    }

    /**
     * Convert To Array
     * ----------------
     * Converts an object that holds objects in keys into an array of those same
     * objects.
     *
     * @param {obj} object - the object to be converted.
     *
     * @return {void}
     */
    public convertUsersListToArray(obj): any[] {
        const i = 1;
        const newArray = [];
        for (const key in obj) {
            newArray.push(obj[key]);
            newArray[newArray.length - 1].index = i + 1; // used to maintain order.
        }
        return newArray;
    }

    /**
     * Filter Groups Lists
     * -------------------
     * Updates the filtered group lists used by UI elements.
     *
     * @return {void}
     */
    private filterGroupLists(): void {
        /* Trash lists. */
        this.filteredTxGroupsList = [];
        this.filteredAdminGroupsList = [];
        this.filteredMenuGroupsList = [];

        /* If we have the groups list... */
        if (Array.isArray(this.allGroupList)) {
            /* Loop groups. */
            for (const index in this.allGroupList) {
                /* Sort group data. */
                let group = this.allGroupList[index];
                group = {
                    id: group.groupId,
                    text: group.groupName,
                };

                /* Push into correct filtered list. */
                if (this.allGroupList[index].groupIsTx === 1) {
                    this.filteredTxGroupsList.push(group);
                } else if (this.allGroupList[index].groupIsTx === 2) {
                    this.filteredMenuGroupsList.push(group);
                } else {
                    this.filteredAdminGroupsList.push(group);
                }
            }
            this.filteredMenuGroupsList.sort((a, b) => {
                return (a.text > b.text ? 1 : -1);
            });
        }
    }

    /**
     * Convert Groups To Array
     * -----------------------
     * Converts an object that holds objects in keys into an array of those same
     * objects.
     *
     * @param {obj} object - the object to be converted.
     *
     * @return {void}
     */
    public convertGroupsToArray(obj): any[] {
        const i = 0;
        const newArray = [];

        for (const key in obj) {
            /* Push the new object. */
            newArray.push(obj[key]);

            /* Index for tab control. */
            newArray[newArray.length - 1].index = i + 1;

            /* Make these all admin type groups. */
            newArray[newArray.length - 1].category = this.userAdminService.resolveGroupType(
                { id: obj[key].groupIsTx });
            if (!newArray[newArray.length - 1].category.length) {
                newArray[newArray.length - 1].category = [{ text: 'No group.' }];
            }
        }
        return newArray;
    }

    /**
     * Handle New User
     * ---------------
     * Handles saving a new user.
     *
     * @param {tabid} - the tab id that the form is in.
     *
     * @return {void}
     */
    public handleNewUser(tabid: number): void {
        /* Show a loading alert */
        this.alertsService.create('loading');

        const thisTab = this.tabsControl[tabid];
        /* Sort the data structure out. */
        const newUser = thisTab.formControl.value;

        newUser.userType = (newUser.userType.length ? newUser.userType[0].id : 0);
        newUser.accountType = (newUser.accountType.length ? newUser.accountType[0].id : 0);

        /* Let's trigger the creation of the user. */
        this.userAdminService.createNewUser(newUser).then((response) => {
            /* Now we've edited the user, we need to send any changes to the groups, wallet access and chain access. */
            const userId = response[1].Data[0].userID.toString();
            const accountID = response[1].Data[0].accountID;
            const walletType = 3;
            const walletName = response[1].Data[0].emailAddress.toString();

            /* Create default wallet if option has been checked */
            if (thisTab.formControl.controls.createDefaultWallet.value) {
                this.userAdminService.createDefaultWallet({
                    userID: Number(userId),
                    accountID,
                    walletType,
                    walletName,
                }).catch((error) => {
                    /* Handle Error. */
                    this.alertsService.generate(
                        'error',
                        this.translate.translate('Failed to create default wallet for user.'),
                    );
                });
            }

            /* Save admin group access. */
            this.userAdminService.updateUserGroups({
                userId,
                toAdd: this.arrayToGroups(newUser.adminGroups),
                toDelete: [],
                chainId: '0',
            }).then((response) => {
                /* Stub. */
            }).catch((error) => {
                /* Handle Error. */
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to save this user\'s administrative groups.'),
                );
            });

            /* Save tx group access. */
            this.userAdminService.updateUserGroups({
                userId,
                toAdd: this.arrayToGroups(newUser.txGroups),
                toDelete: [],
                chainId: thisTab['selectedChain'],
            }).then((response) => {
                /* Stub. */
            }).catch((error) => {
                /* Handle Error. */
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to save this user\'s transactional groups.'),
                );
            });

            /* Save admin group access. */
            this.userAdminService.updateUserGroups({
                userId,
                toAdd: this.arrayToGroups(newUser.menuGroups),
                toDelete: [],
                chainId: '0',
            }).then((response) => {
                /* Stub. */
            }).catch((error) => {
                /* Handle Error. */
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to save this user\'s menu groups.'),
                );
            });

            /* Save wallet access. */
            this.userAdminService.newUserWalletPermissions({
                userId,
                walletAccess: this.getWalletAccessFromTab(newUser),
            }).then((response) => {
                /* Stub. */
            }).catch((error) => {
                /* Handle Error. */
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to save this user\'s wallet permissions.'),
                );
            });

            /* Save wallet access. */
            this.userAdminService.updateUserGroupWalletPermissions({
                userId,
                toAdd: this.getGroupWalletAccessFromTab(newUser),
                toUpdate: {},
                toDelete: {},
            }).then((response) => {
                /* Stub. */
            }).catch((error) => {
                /* Handle Error. */
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to save this user\'s group wallet permissions.'),
                );
            });

            /* Save the chain access. */
            this.userAdminService.updateUserChainAccess({
                userId,
                toAdd: this.getChainAccessFromTab(newUser),
                toDelete: [],
            }).then((response) => {
                /* Stub. */
            }).catch((error) => {
                /* Handle Error. */
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to save this user\'s chain access.'),
                );
            });

            /* Clear the form. */
            this.clearNewUser(1, false);

            /* Handle success. */
            this.updateUserList(() => {
                /* Handle success message & update users list */
                this.logService.log('Successfully created user.', response);
                this.alertsService.generate(
                    'success',
                    this.translate.translate('Successfully created user.'),
                );
            });
        }).catch((error) => {
            /* Handle error. */
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to save this user.'),
            );

            console.warn('Failed to save this user: ', error);
        });

        /* Return. */
        return;
    }

    /**
     * Handle Edit User
     * ----------------
     * Handles saving an edited user.
     *
     * @param {tabid} number - The form control object that relates
     * to this edit form tab.
     * @return {void}
     */
    public handleEditUser(tabid: number): void {
        /* Show a loading alert */
        this.alertsService.create('loading');

        const thisTab = this.tabsControl[tabid];

        /* Sort the data structure out. */
        const formData = thisTab.formControl.value;
        const dataToSend = {
            userId: thisTab.userId.toString(),
            email: formData.email,
            userType: formData.userType.length ? formData.userType[0].id : 0,
            account: formData.accountType.length ? formData.accountType[0].id : 0,
            status: formData.userLocked,
        };

        /* Let's send the edit request. */
        this.userAdminService.editUser(dataToSend).then((response) => {
            /* Create default wallet if option has been checked */
            if (!this.hasDefaultWallet && thisTab.formControl.controls.createDefaultWallet.value) {
                const userData = response[1].Data[0];

                const userId = userData.userID;
                const accountID = userData.accountID;
                const walletType = 3;
                const walletName = userData.emailAddress.toString();

                this.userAdminService.createDefaultWallet({
                    userID: Number(userId),
                    accountID,
                    walletType,
                    walletName,
                }).then((res) => {
                    /* Default wallet successfully created for the user */
                    this.hasDefaultWallet = true;
                }).catch((error) => {
                    /* Handle Error. */
                    this.alertsService.generate(
                        'error',
                        this.translate.translate('Failed to create default wallet for user.'),
                    );
                });
            }

            /* Now we've edited the user, we need to send any changes to the groups. */
            const adminGroupChanges = this.diffUserGroups(thisTab.oldAdminGroups, this.arrayToGroups(
                formData.adminGroups));
            const txGroupChanges = this.diffUserGroups(thisTab.oldTxGroups, this.arrayToGroups(formData.txGroups));
            const menuGroupChanges = this.diffUserGroups(thisTab.oldMenuGroups, this.arrayToGroups(
                formData.menuGroups));

            /* Save admin group access. */
            this.userAdminService.updateUserGroups({
                userId: thisTab.userId.toString(),
                toAdd: adminGroupChanges.toAdd,
                toDelete: adminGroupChanges.toDelete,
                chainId: '0',
            }).then((response) => {
                this.logService.log('updated user admin groups.', response);
            }).catch((error) => {
                this.logService.log('error updating user admin groups.', error);
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to update this user\'s administrative groups.'),
                );
            });

            /* Save tx group access. */
            this.userAdminService.updateUserGroups({
                userId: thisTab.userId.toString(),
                toAdd: txGroupChanges.toAdd,
                toDelete: txGroupChanges.toDelete,
                chainId: thisTab['selectedChain'],
            }).then((response) => {
                this.logService.log('updated user tx groups.', response);
            }).catch((error) => {
                this.logService.log('error updating user tx groups.', error);
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to update this user\'s transactional groups.'),
                );
            });

            /* Save menu group access. */
            this.userAdminService.updateUserGroups({
                userId: thisTab.userId.toString(),
                toAdd: menuGroupChanges.toAdd,
                toDelete: menuGroupChanges.toDelete,
                chainId: 0,
            }).then((response) => {
                this.logService.log('updated user menu groups.', response);
            }).catch((error) => {
                this.logService.log('error updating user menu groups.', error);
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to update this user\'s menu groups.'),
                );
            });

            /* Save wallet access, first diff, then set the new ones to the old ones. */
            const newWalletAccess = this.getWalletAccessFromTab(formData);
            const diffWalletAccess = this.userAdminService.getWalletAccessDiff(
                thisTab['oldWalletAccess'],
                newWalletAccess,
            );

            this.userAdminService.updateUserWalletPermissions({
                userId: thisTab.userId.toString(),
                toAdd: diffWalletAccess.toAdd,
                toUpdate: diffWalletAccess.toUpdate,
                toDelete: diffWalletAccess.toDelete,
            }).then((response) => {
                /* Overwrite the old permissions, to allow diffing. */
                this.logService.log('updated user wallet permissions.', response);
                thisTab['oldWalletAccess'] = newWalletAccess;
            }).catch((error) => {
                this.logService.log('error updating user wallet permissions.', error);
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to update this user\'s wallet permissions.'),
                );
            });

            /* Save group wallet access, first diff, then set the new ones to the old ones. */
            const newGroupWalletAccess = this.getGroupWalletAccessFromTab(formData);
            const diffGroupWalletAccess = this.userAdminService.getWalletAccessDiff(
                thisTab['oldGroupWalletAccess'],
                newGroupWalletAccess,
            );
            this.userAdminService.updateUserGroupWalletPermissions({
                userId: thisTab.userId.toString(),
                toAdd: diffGroupWalletAccess.toAdd,
                toUpdate: diffGroupWalletAccess.toUpdate,
                toDelete: diffGroupWalletAccess.toDelete,
            }).then((response) => {
                /* Overwrite the old permissions, to allow diffing. */
                this.logService.log('updated user group wallet permissions.', response);
                thisTab['oldGroupWalletAccess'] = newGroupWalletAccess;
            }).catch((error) => {
                this.logService.log('error updating user group wallet permissions.', error);
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to update this user\'s group wallet permissions.'),
                );
            });

            /* Now we'll save chain access, first get the diffs. */
            const newChainAccess = this.getChainAccessFromTab(formData);
            const diffChainAccess = this.diffChainAccess(
                thisTab['oldChainAccess'],
                newChainAccess,
            );
            this.userAdminService.updateUserChainAccess({
                userId: thisTab.userId.toString(),
                toAdd: diffChainAccess.toAdd,
                toDelete: diffChainAccess.toDelete,
            }).then((response) => {
                /* Overwrite the old permissions, to allow diffing future changes. */
                thisTab['oldChainAccess'] = newChainAccess.map((chain) => {
                    return {
                        id: chain.chainId,
                        text: chain.chainName,
                    };
                });
                this.logService.log('updated user chain access: ', response);
            }).catch((error) => {
                this.logService.log('error updating user wallet permissions.', error);
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to update this user\'s wallet permissions.'),
                );
            });

            this.updateUserList(() => {
                /* Handle success message & update users list */
                this.logService.log('Successfully edited user.', response);
                this.alertsService.generate(
                    'success',
                    this.translate.translate('Successfully updated user details.'),
                );
            });
        }).catch((error) => {
            /* Handle error message. */
            this.logService.log('Failed to edit user.', error);
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to update user details.'),
            );
        });

        /* Return */
        return;
    }

    private diffChainAccess(oldAccessArr, newAccessArr): any {
        /* Convert the arrays to objects. */
        const oldAccess = {};
        const newAccess = {};
        oldAccessArr.map && oldAccessArr.map((chain) => {
            oldAccess[chain.id] = chain;
        });
        newAccessArr.map && newAccessArr.map((chain) => {
            newAccess[chain.chainId] = chain;
        });

        /* Variables. */
        const differences = {
            toAdd: [],
            toDelete: [],
        };
        let res;

        /* First, let's see what's new. */
        for (const i in newAccess) {
            /* If it's not in the old one, the add it. */
            if (!oldAccess[i]) {
                res = this.getChainById(newAccess[i].chainId);
                differences.toAdd.push(res);
            }
        }

        /* Lastly, let's check if any were deleted. */
        for (const j in oldAccess) {
            /* If it's not in the new access, it's been deleted. */
            if (!newAccess[j]) {
                res = this.getChainById(oldAccess[j].id);
                differences.toDelete.push(res);
            }
        }

        /* Return. */
        return differences;
    }

    private diffUserGroups(oldGroups, newGroups): { toAdd: {}[], toDelete: {}[] } {
        /* Variables. */
        const toAdd = [];
        const toDelete = [];

        /* Get the removed ones. */
        for (const key in oldGroups) {
            if (!newGroups[key]) toDelete.push(oldGroups[key]);
        }

        /* Get the added ones. */
        for (const key in newGroups) {
            if (!oldGroups[key]) {
                const groupFetch = this.getGroupById(newGroups[key].groupId);
                if (groupFetch.groupId) toAdd.push(groupFetch);
            }
        }

        /* Return. */
        return { toAdd, toDelete };
    }

    private getWalletAccessFromTab(formData): { [walletId: number]: number } {
        /* Object of changes. */
        const walletAccess = {};

        /* Get each wallet and push into wallet access. */
        for (const i in formData['walletsRead']) {
            walletAccess[formData['walletsRead'][i].id] = 1;
        }

        for (const j in formData['walletsFull']) {
            walletAccess[formData['walletsFull'][j].id] = 3;
        }

        /* Return. */
        return walletAccess;
    }

    private getGroupWalletAccessFromTab(formData): { [accountId: number]: number } {
        /* Object of changes. */
        const groupWalletAccess = {};

        /* Get each wallet and push into wallet access. */
        for (const i in formData['groupWalletsRead']) {
            groupWalletAccess[formData['groupWalletsRead'][i].id] = 1;
        }

        for (const j in formData['groupWalletsFull']) {
            groupWalletAccess[formData['groupWalletsFull'][j].id] = 3;
        }

        /* Return. */
        return groupWalletAccess;
    }

    private getChainAccessFromTab(formData): any {
        /* Object of changes. */
        const chainAccess = [];

        /* Get each wallet and push into wallet access. */
        for (const i in formData['chainAccess']) {
            const resolution = this.getChainById(formData['chainAccess'][i].id);
            chainAccess.push(resolution);
        }

        /* Return. */
        return chainAccess;
    }

    /**
     * Get Group By Id
     * ---------------
     * Get a full group object by Id.
     *
     * @param  {id} number - th group id.
     * @return {void}
     */
    public getGroupById(id) {
        /* Look for the group and return it... */
        for (const key in this.allGroupList) {
            if (this.allGroupList[key].groupId === Number(id)) {
                return this.allGroupList[key];
            }
        }

        /* ...else return nothing. */
        return {};
    }

    /**
     * Get Chain By Id
     * ---------------
     * Get a full chain object by Id.
     *
     * @param  {id} number - th chain id.
     * @return {void}
     */
    public getChainById(id) {
        /* Look for the group and return it... */
        for (const key in this.chainList) {
            if (this.chainList[key].chainId === Number(id)) {
                return this.chainList[key];
            }
        }

        /* ...else return nothing. */
        return {};
    }

    /**
     * Get Wallet By Id
     * ----------------
     * Get a full wallet object by Id.
     *
     * @param  {id} number - th group id.
     * @return {void}
     */
    public getWalletById(id) {
        /* Look for the wallet and return it... */
        for (const key in this.manageWalletList) {
            if (this.manageWalletList[key].walletId === Number(id)) {
                return this.manageWalletList[key];
            }
        }

        /* ...else return nothing. */
        return {};
    }

    /**
     * Handle Delete
     * -------------
     * Handles the deletion of a user.
     *
     * @param {deleteUserIndex} object - Contains the target user's index.
     *
     * @return {void}
     */
    public handleDelete(userId: number): void {
        const userIndex = _.findIndex(this.usersList, (user) => {
            return user.userID === userId;
        });

        /* Get the user's data. */
        const dataToSend = {};
        dataToSend['userId'] = this.usersList[userIndex].userID;
        dataToSend['account'] = this.usersList[userIndex].accountID;

        /* Send the request. */
        /* Let's now ask the user if they're sure... */
        this.confirmationService.create(
            `<span>${this.translate.translate('Deleting a User')}</span>`,
            `<span class="text-warning">${this.translate.translate(
                'Are you sure you want to delete @userName@?',
                { userName: this.usersList[userIndex].userName },
            )}</span>`,

        ).subscribe((ans) => {
            /* ...if they are... */
            if (ans.resolved) {
                /* ...now send the request. */
                this.userAdminService.deleteUser(dataToSend).then((response) => {
                    /* Close any tabs open for this wallet. */
                    for (const i in this.tabsControl) {
                        if (this.tabsControl[i].userID === dataToSend['userId']) {
                            this.closeTab(i);
                            break;
                        }
                    }

                    /* Handle success message. */
                    this.updateUserList(() => {
                        /* Handle success message & update users list */
                        this.alertsService.generate(
                            'success',
                            this.translate.translate('Successfully deleted user.'),
                        );
                    });
                }).catch((error) => {
                    /* Handle error message. */
                    this.alertsService.generate(
                        'error',
                        this.translate.translate('Failed to delete user.'),
                    );
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
     * Handles the editting of a user.
     *
     * @param {userId} number - The userId of a user to be editted.
     *
     * @return {void}
     */
    public handleEdit(userId: number): void {
        const userIndex = _.findIndex(this.usersList, (user) => {
            return user.userID === userId;
        });

        /* Check if the tab is already open. */
        for (let i = 0; i < this.tabsControl.length; i += 1) {
            if (this.tabsControl[i].userId === this.usersList[userIndex].userID) {
                /* Found the index for that tab, lets activate it... */
                // this.setTabActive(i);
                this.router.navigateByUrl(`/user-administration/users/${i}`);

                /* And return. */
                return;
            }
        }

        /* Let's fix some data. */
        const user = this.usersList[userIndex];
        const accountType = this.userAdminService.resolveAccountType({ text: user.accountName });
        const userType = this.userAdminService.resolveUserType({ id: user.userType });

        /* And push the tab into it's place. */
        this.tabsControl.push({
            title: {
                icon: 'fa-user',
                text: this.usersList[userIndex].userName,
            },
            userId: user.userID,
            defaultWalletID: user.defaultWalletID,
            formControl: this.getNewUserFormGroup('edit'),
            oldAdminGroups: {},
            oldTxGroups: {},
            oldMenuGroups: {},
            selectedChain: 0,
            filteredTxList: [], // filtered groups of this chainid.
            selectedTxList: [], // groups to show as selected.
            allocatedTxList: [], // all groups assigned to the user.
            selectedMenuList: [], // groups to show as selected.
            filteredWalletsByAccount: [], // filtered wallets by account.
            oldWalletAccess: {},
            oldGroupWalletAccess: {},
            oldChainAccess: [],
            active: false, // this.editFormControls
        });

        /* Reference the new tab. */
        const newTabId = this.tabsControl.length - 1;

        /* Now let's prefill the user's meta data. */
        this.tabsControl[newTabId].formControl.controls['username'].patchValue(user.userName);
        this.tabsControl[newTabId].formControl.controls['email'].patchValue(user.emailAddress);
        this.tabsControl[newTabId].formControl.controls['accountType'].patchValue(accountType);
        this.tabsControl[newTabId].formControl.controls['userType'].patchValue(userType);
        this.tabsControl[newTabId].formControl.controls['userLocked'].patchValue(user.accountLocked);

        /* Get Admin permissions. */
        this.userAdminService.requestUserPermissions({
            entityId: user.userID,
            isTx: 0,
        }).then((response) => {
            /* So now we can select the user's permissions. */
            const userAdminPermissions = this.usersPermissionsList['usersAdminPermissions'][user.userID] || {};

            /* Next we can set it to the old and current groups. */
            this.tabsControl[newTabId].formControl.controls['adminGroups'].patchValue(this.groupsToArray(
                userAdminPermissions));
            this.tabsControl[newTabId]['oldAdminGroups'] = userAdminPermissions;
        }).catch((error) => {
            /* handle the error message */
            this.logService.log('Editing user, admin permissions error: ', error);
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to fetch this user\'s administrative permissions.'),
            );
        });

        /* Get Tx permissions. */
        this.userAdminService.requestUserPermissions({
            entityId: user.userID,
            isTx: 1,
        }).then((response) => {
            /* So now we can select the user's permissions. */
            const userTxPermissions = this.usersPermissionsList['usersTxPermissions'][user.userID] || {};

            /* Next we can set it to the old and allocatedTxList, which will be used on chain change. */
            this.tabsControl[newTabId]['oldTxGroups'] = userTxPermissions; // used to diff later.
            this.tabsControl[newTabId]['allocatedTxList'] = this.groupsToArray(userTxPermissions);

        }).catch((error) => {
            /* Handle the error message */
            this.logService.log('Editing user, tx permissions error: ', error);
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to fetch this user\'s transactional permissions.'),
            );
        });

        /* Get Menu permissions. */
        this.userAdminService.requestUserPermissions({
            entityId: user.userID,
            isTx: 2,
        }).then((response) => {
            /* So now we can select the user's permissions. */
            const userMenuPermissions = this.usersPermissionsList['usersMenuPermissions'][user.userID] || {};

            /* Next we can set it to the old and current groups. */
            this.tabsControl[newTabId].formControl.controls['menuGroups'].patchValue(
                this.groupsToArray(userMenuPermissions));
            this.tabsControl[newTabId]['oldMenuGroups'] = userMenuPermissions;
        }).catch((error) => {
            /* handle the error message */
            this.logService.log('Editing user, menu permissions error: ', error);
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to fetch this user\'s menu permissions.'),
            );
        });

        this.userAdminService.requestUserWalletPermissions({
            userId: user.userID,
        }).then((response) => {
            /* So now, we have access to the data in redux. */
            const userWalletPermissions = this.usersWalletPermissions[user.userID] || {};
            this.tabsControl[newTabId]['oldWalletAccess'] = {};
            this.logService.log('Got user wallet permission: ', userWalletPermissions);

            /* So first let's set the account ID on the tab... */
            this.setFormAccountId(newTabId, accountType[0]);

            /* If this user has no wallet permissions... bail. */
            if (!Object.keys(userWalletPermissions).length) {
                return;
            }

            /* Set the old wallet access, this'll be used to diff later. */
            userWalletPermissions.map && userWalletPermissions.map((wallet) => {
                /* Build the structure in the old  */
                this.tabsControl[newTabId]['oldWalletAccess'][wallet.walletID] = wallet.permission;
            });

            /* ...then filter and preset the read wallets...  */
            const readAccessWallets = userWalletPermissions
            .filter(wallet => wallet.permission === 1)
            .map((wallet) => {
                wallet = this.getWalletById(wallet.walletID);
                return {
                    id: wallet.walletId,
                    text: wallet.walletName,
                };
            });
            this.tabsControl[newTabId].formControl.controls['walletsRead'].patchValue(readAccessWallets);

            /* ...and lastly the same for the full access wallets. */
            const fullAccessWallets = userWalletPermissions
            .filter(wallet => wallet.permission === 3)
            .map((wallet) => {
                wallet = this.getWalletById(wallet.walletID);
                return {
                    id: wallet.walletId,
                    text: wallet.walletName,
                };
            });
            this.tabsControl[newTabId].formControl.controls['walletsFull'].patchValue(fullAccessWallets);

        }).catch((error) => {
            /* Handle the error message */
            this.logService.log('Editing user, wallet permission error: ', error);
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to fetch this user\'s wallet permissions.'),
            );
        });

        /* Get user's group wallet permission */
        this.userAdminService.requestUserGroupWalletPermissions({
            userId: user.userID,
        }).then((response) => {
            const userGroupWalletPermission = _.get(response, '[1].Data', []);

            this.tabsControl[newTabId]['oldGroupWalletAccess'] = {};
            this.logService.log('Got user group wallet permission: ', userGroupWalletPermission);

            /* If this user has no wallet permissions... bail. */
            if (!Object.keys(userGroupWalletPermission).length) {
                return;
            }

            /* Set the old wallet access, this'll be used to diff later. */
            userGroupWalletPermission.map && userGroupWalletPermission.map((group) => {
                /* Build the structure in the old  */
                this.tabsControl[newTabId]['oldGroupWalletAccess'][group.accountID] = group.permission;
            });

            /* ...then filter and preset the read group wallets...  */
            const readAccessGroupWallets = userGroupWalletPermission
            .filter(group => group.permission === 1)
            .map((group) => {
                const accountList = this.userAdminService.getAccountTypes();
                const matchedGroups = accountList.filter(item => item.id === group.accountID);
                // there should be only one match.
                return matchedGroups[0];
            });
            this.tabsControl[newTabId].formControl.controls['groupWalletsRead'].patchValue(readAccessGroupWallets);

            /* ...and lastly the same for the full access group wallets. */
            const fullAccessGroupWallets = userGroupWalletPermission
            .filter(group => group.permission === 3)
            .map((group) => {
                const accountList = this.userAdminService.getAccountTypes();
                const matchedGroups = accountList.filter(item => item.id === group.accountID);
                // there should be only one match.
                return matchedGroups[0];
            });
            this.tabsControl[newTabId].formControl.controls['groupWalletsFull'].patchValue(fullAccessGroupWallets);
        }).catch((error) => {
            /* Handle the error message */
            this.logService.log('Editing user, group wallet permission error: ', error);
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to fetch this user\'s group wallet permissions.'),
            );
        });

        /* Now we need to get the user's wallet access. */
        this.userAdminService.requestUserChainAccess({
            userId: user.userID,
        }).then((response) => {
            this.logService.log('got chain access: ', response);
            /* So we've requested the data, now we can access it. */
            let userChainAccess = this.usersChainAccess[user.userID] || [];
            let resolution;

            /* Update the chain ID. Fallback to selectedChainItem if user has no chain assigned to them */
            if (userChainAccess.length) this.setFormChainId(newTabId, { id: userChainAccess[0].chainID });
            else if (this.selectedChainItem.length) this.setFormChainId(newTabId, this.selectedChainItem[0]);

            /* Let's tidy it up for the ng2-select and patch the value... */
            userChainAccess = userChainAccess.map((chain) => {
                resolution = this.getChainById(chain.chainID);
                this.logService.log(resolution);
                return {
                    id: resolution.chainId,
                    text: resolution.chainName,
                };
            })
            /* Filter to remove chains that we can't see. */
            .filter(chain => !!chain.id);

            /* Set the past access and the form control value. */
            this.tabsControl[newTabId]['oldChainAccess'] = userChainAccess;
            this.tabsControl[newTabId].formControl.controls['chainAccess'].patchValue(userChainAccess);
            this.logService.log('update value', this.tabsControl);
        }).catch((error) => {
            /* Handle the error message */
            this.logService.log('Failed to fetch user\'s chain access: ', error);
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to fetch this user\'s chain access.'),
            );
        });

        /* Activate the new tab. */
        // this.setTabActive(this.tabsControl.length - 1);
        this.router.navigateByUrl(`/user-administration/users/${newTabId}`);

        /* Return. */
        return;
    }

    private groupsToArray(groupsObject) {
        /* Variable. */
        const newArr = [];

        /* Loop and fetch the rest of the data. */
        for (const key in groupsObject) {
            const resolution = this.userAdminService.resolveGroup({ groupId: groupsObject[key].groupID })[0];
            if (resolution) {
                newArr.push({
                    id: resolution.groupId,
                    text: resolution.groupName,
                });
            }
        }

        /* Return. */
        return newArr;
    }

    private arrayToGroups(groupsArray) {
        /* Variable. */
        const newObject = {};

        /* Loop and fetch the rest of the data. */
        for (const i in groupsArray) {
            const resolution = this.userAdminService.resolveGroup({ groupId: groupsArray[i].id })[0];
            if (resolution) {
                newObject[groupsArray[i].id] = resolution;
            }
        }

        /* Return. */
        return newObject;
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
            ...this.tabsControl.slice(index + 1, this.tabsControl.length),
        ];

        /* Reset tabs. */
        this.router.navigateByUrl('/user-administration/users/0');

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
    public clearNewUser(tabid, event): void {
        /* Prevent submit. */
        if (event) event.preventDefault();

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        /* Return. */
        return;
    }

    /**
     * Get New user Formgroup
     * ----------------------
     * Returns a new user form group.
     * @return {FormGroup}
     */
    getNewUserFormGroup(type: string = 'new'): FormGroup {
        /* Declare the group. */
        const group = new FormGroup(
            {
                username: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9-_@.]{1,45}$')]),
                email: new FormControl('', [Validators.required, Validators.pattern(
                    '^([(][A-z0-9]+[)])?(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@' +
                    '((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')]),
                accountType: new FormControl('', [Validators.required]),
                userType: new FormControl('', [Validators.required]),
                createDefaultWallet: new FormControl(1),
                userLocked: new FormControl(0),
                password: new FormControl('', [Validators.required]),
                passwordConfirm: new FormControl('', [Validators.required]),
                adminGroups: new FormControl([]),
                txGroups: new FormControl([]),
                menuGroups: new FormControl([]),
                walletsFull: new FormControl([]),
                walletsRead: new FormControl([]),
                groupWalletsFull: new FormControl([]),
                groupWalletsRead: new FormControl([]),
                chainAccess: new FormControl([]),
            },
            this.passwordValidator);

        return group;
    }

    /**
     * Validates Password Fields
     * -------------------------
     * Checks the 2 password fields match and throws an error if not
     *
     * @param {FormGroup} g
     * @returns {null}
     */
    passwordValidator(g: FormGroup) {
        if (g.get('password').value !== '' && g.get('passwordConfirm').value !== '') {
            const password = g.get('password').value;
            const passwordConfirm = g.get('passwordConfirm').value;
            g.controls.password.setErrors(password === passwordConfirm ? null : { mismatch: true });
            g.controls.passwordConfirm.setErrors(password === passwordConfirm ? null : { mismatch: true });
        }
        return null;
    }

    /**
     * Send Reset Password Email
     * -------------------------
     * Sends the user being edited a Reset Password Email
     */
    sendResetPassword(tabID: string, event: any) {
        event.preventDefault();
        const emailControl = _.get(this.tabsControl, `[${tabID}].formControl.controls.email`, {});

        if (emailControl.valid && emailControl.value) {
            this.confirmationService.create(
                `<span>${this.translate.translate('Reset Password')}</span>`,
                `<span class="text-warning">${this.translate.translate(
                    'Are you sure you want to send a reset password email to @email@?',
                    { email: emailControl.value })}</span>`,
            ).subscribe((ans) => {
                if (ans.resolved) {
                    const asyncTaskPipe = this.myUserService.forgotPassword({
                        username: emailControl.value,
                        lang: this.language,
                    });

                    this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                        asyncTaskPipe,
                        () => {
                            this.alertsService.generate(
                                'success',
                                this.translate.translate('Reset password email successfully sent.'),
                            );
                        },
                        () => {
                            this.alertsService.generate(
                                'error',
                                this.translate.translate('Sorry, something went wrong.<br>Please try again later.'),
                            );
                        }),
                    );
                }
            });
        } else {
            this.alertsService.generate(
                'error',
                this.translate.translate('User\'s email address is invalid. Please check and try again.'),
            );
        }
    }

    /**
     * Send Reset Two-Factor Email
     * -------------------------
     * Sends the user being edited a Reset Two-Factor Authentication Email
     */
    sendResetTwoFactor(tabID: number, event: any) {
        event.preventDefault();
        const emailControl = _.get(this.tabsControl, `[${tabID}].formControl.controls.email`, {});

        if (emailControl.valid && emailControl.value) {
            this.confirmationService.create(
                `<span>${this.translate.translate('Reset Two-Factor')}</span>`,
                `<span class="text-warning">${this.translate.translate(
                    'Are you sure you want to send a reset Two-Factor email to @email@?',
                    { email: emailControl.value })}</span>`,
            ).subscribe((ans) => {
                if (ans.resolved) {
                    const asyncTaskPipe = this.myUserService.forgotTwoFactor({ email: emailControl.value });

                    this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                        asyncTaskPipe,
                        () => {
                            this.alertsService.generate(
                                'success',
                                this.translate.translate('Reset Two-Factor email successfully sent.'),
                            );
                        },
                        () => {
                            this.alertsService.generate(
                                'error',
                                this.translate.translate('Sorry, something went wrong.<br>Please try again later.'),
                            );
                        }),
                    );
                }
            });
        } else {
            this.alertsService.generate(
                'error',
                this.translate.translate('User\'s email address is invalid. Please check and try again.'),
            );
        }
    }

    handleSearch(value) {
        this.search = value;

        if (this.search) {
            const asyncTaskPipe = this.adminUserService.requestMyUsersList(0, 0, this.search);

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [],
                [],
                asyncTaskPipe,
                {},
                (data) => {
                    if (_.get(data, '[1].Data[0].userID', 0)) {
                        this.searchedUsersList = data[1].Data;

                        if (this.searchedUsersList.length) {
                            this.dgTotalItems = this.searchedUsersList.length;
                            this.currentPage = 1;
                            this.setPaginatedUsersList();
                        }
                    } else {
                        this.dgTotalItems = 0;
                        this.searchedUsersList = [];
                        this.paginatedUsersList = [];
                        this.currentPage = 1;
                        this.changeDetectorRef.detectChanges();
                    }
                },
                () => {
                }),
            );
        } else {
            this.clearSearch();
        }
    }

    clearSearch(event?: any) {
        if (event) {
            event.preventDefault();
        }

        this.search = '';
        this.searchedUsersList = [];
        this.dgTotalItems = this.totalRecords;
        this.setPaginatedUsersList();
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsubscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }

        this.ngRedux.dispatch(userAdminActions.setAllTabs(this.tabsControl));
    }
}
