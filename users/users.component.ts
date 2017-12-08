/* Core imports. */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    ViewChild
} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {NgRedux, select} from "@angular-redux/store";
/* Alerts and confirms. */
import {AlertsService} from "@setl/jaspero-ng2-alerts";
import {ConfirmationService} from "@setl/utils";
/* User Admin Service. */
import {UserAdminService} from "../useradmin.service";

/* Decorator. */
@Component({
    selector: 'setl-admin-users',
    templateUrl: 'users.component.html',
    styleUrls: ['users.component.css'],
    providers: [UserAdminService],
    changeDetection: ChangeDetectionStrategy.OnPush
})

/* Class. */
export class AdminUsersComponent implements AfterViewInit, OnDestroy {
    /* Users data grid */
    @ViewChild('usersDataGrid') usersDataGrid;

    /* User data. */
    public usersList: any;

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
    private subscriptions: { [key: string]: any } = {};

    /* Filtered groups list. */
    public filteredAdminGroupsList = [];
    public filteredTxGroupsList = [];

    @select(['userAdmin', 'chains', 'chainList']) chainListObservable;
    public chainList: { [chainId: number]: { chainId: number | string, chainName: string } } = {};
    public filteredChainList: Array<{ id: number | string, text: string }> = [];

    @select(['userAdmin', 'chain', 'requestedChainList']) requestedChainListOb;

    @select(['user', 'myDetail']) myDetailOb;
    public myDetail: any;

    @select(['wallet', 'managedWallets', 'walletList']) manageWalletsListOb;
    private manageWalletList: any;

    /* Constructor. */
    constructor(private userAdminService: UserAdminService,
                private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private _confirmationService: ConfirmationService,) {
        /* Get Account Types. */
        this.accountTypes = userAdminService.getAccountTypes();

        /* Get User Types. */
        this.userTypes = userAdminService.getUserTypes();

        /* Subscribe to the admin user list observable. */
        this.subscriptions['userListSubscription'] = this.userAdminService.getUserListSubject().subscribe((list) => {
            this.usersList = this.convertToArray(list);

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
        this.subscriptions['usersPermissionsList'] = this.userAdminService.getUsersPermissionsListSubject().subscribe((list) => {
            /* Set raw list. */
            this.usersPermissionsList = list;

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Subscribe to the user wallet permissions observable. */
        this.subscriptions['usersWalletPermissions'] = this.userAdminService.getUsersWalletPermissionsSubject().subscribe((list) => {
            /* Set raw list. */
            this.usersWalletPermissions = list;

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Subscribe to the user wallet permissions observable. */
        this.subscriptions['usersChainAccess'] = this.userAdminService.getUsersChainAccessSubject().subscribe((list) => {
            /* Set raw list. */
            this.usersChainAccess = list;

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Default tabs. */
        this.tabsControl = [
            {
                "title": {
                    "icon": "fa-search",
                    "text": "Search"
                },
                "userId": -1,
                "active": true
            },
            {
                "title": {
                    "icon": "fa-user",
                    "text": "Add User"
                },
                "userId": -1,
                "formControl": this.getNewUserFormGroup(),
                "selectedChain": 0,
                "filteredTxList": [], // filtered groups of this chainid.
                "selectedTxList": [], // groups to show as selected.
                "allocatedTxList": [], // all groups assigned to the user.
                "filteredWalletsByAccount": [], // filtered wallets by account.
                "oldChainAccess": {},
                "active": false
            }
        ];
    }

    ngAfterViewInit(): void {
        this.subscriptions['chainList'] = this.chainListObservable.subscribe((chainList) => {
            /* Varibales. */
            let chainId;

            /* Update chain list. */
            this.chainList = chainList;

            /* Update the fitered list. */
            this.filteredChainList = [];
            for (chainId in chainList) {
                this.filteredChainList.push({
                    id: chainId,
                    text: chainList[chainId].chainName
                });
            }

            console.log("chain list: ", this.filteredChainList);
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
        let selectedChainId = thisTab['selectedChain'] = data.id;

        /* Now let's filter the groups list to just groups assigned to this chain. */
        let groupsOfThisChain = this.allGroupList.filter((group) => {
            /* Check if group is tx. */
            if (group.groupIsTx) {
                /* If we're admin, ignore chainId... */
                if (this.myDetail.admin == 1) return true;

                /* ...else check if the group belongs to this one. */
                return group.chainId == selectedChainId;
            }

            /* ...if not, axe it. */
            return false;
        }).map((group) => {
            /* Then we'll map them into a nicer array of objects ng2-select. */
            return {
                id: group.groupId,
                text: group.groupName
            }
        });

        /* Let's set that nice filtered list to the bound property for the list. */
        thisTab.filteredTxList = groupsOfThisChain;

        /* Now let's get the list of groups this user is in and filter them against
         the groups we have in this chain's filtered list. */
        let
            i, allocatedTxList = this.tabsControl[tabid].allocatedTxList,
            filteredAllocatedGroups = groupsOfThisChain.filter((group) => {
                // loop over each group they're in and check if it's in this chain...
                for (i in allocatedTxList) {
                    if (allocatedTxList[i].id == group.id) {
                        return true;
                    }
                }

                // ...else return negative.
                return false;
            });

        /* Now set the selected groups to the allocated groups filtered byt this chain. */
        thisTab.formControl.controls['txGroups'].patchValue(filteredAllocatedGroups);

        /* Return. */
        return;
    }

    /**
     * Set Form Account Id
     * -----------------
     * Sets the account Id on a tab object, to be used by the tab forms.
     *
     * @param  {tabid} number - The tab id to be set.
     * @param  {data} object - The event object that ng2 select gives off.
     *
     * @return {void}
     */
    public setFormAccountId(tabid, data): void {
        const thisTab = this.tabsControl[tabid];
        /* Ok, first, lets save the account Id that is selcted. */
        let selectedAccount = thisTab['selectedAccount'] = data;

        /* And now filter the new list to the new account. */
        let key, filteredWallets = [];
        for (key in this.manageWalletList) {
            /* Check the id. */
            if (selectedAccount.text == this.manageWalletList[key].accountName) {
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
     * ------------------------
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
        const
            thisTab = this.tabsControl[tabid],
            controls = thisTab.formControl.controls;

        /* Varibales. */
        let
            i, j;

        /* So let's figure out if they've added duplicate wallets... */
        setTimeout(() => {
            for (i in controls["walletsFull"].value) {
                for (j in controls["walletsRead"].value) {
                    /* If we have a duplicate wallet... */
                    if (controls["walletsRead"].value[j] != undefined && controls["walletsFull"].value[i] != undefined) {
                        if (controls["walletsRead"].value[j].id == controls["walletsFull"].value[i].id) {
                            /* ...then we should remove it from the other select and tell the user. */
                            if (fullAccess) {
                                delete controls["walletsRead"].value[j];
                                controls["walletsRead"].patchValue(
                                    controls["walletsRead"].value.filter(thing => !!thing)
                                );
                                this.showWarning('You changed access to \'' + controls["walletsFull"].value[i].text + '\'<br /><br /><b>Read access</b> <i class="fa fa-arrow-right"></i> <b>Full access</b>.')
                            } else {
                                delete controls["walletsFull"].value[i];
                                controls["walletsFull"].patchValue(
                                    controls["walletsFull"].value.filter(thing => !!thing)
                                );

                                this.showWarning('You changed access to \'' + controls["walletsRead"].value[j].text + '\'<br /><br /><b>Full access</b> <i class="fa fa-arrow-right"></i> <b>Read access</b>.')
                            }
                        }
                    }
                }
            }
        }, 50);

    }

    /**
     * Convert To Array
     * ---------------
     * Converts an object that holds objects in keys into an array of those same
     * objects.
     *
     * @param {obj} object - the object to be converted.
     *
     * @return {void}
     */
    public convertToArray(obj): Array<any> {
        let i = 1, key, newArray = [];
        for (key in obj) {
            newArray.push(obj[key]);
            newArray[newArray.length - 1].index = i++; // used to maintain order.
        }
        return newArray;
    }

    /**
     * Filter Groups Lists
     * -----------------
     * Updates the filtered group lists used by UI elements.
     *
     * @return {void}
     */
    private filterGroupLists(): void {
        /* Trash lists. */
        this.filteredTxGroupsList = [];
        this.filteredAdminGroupsList = [];

        /* If we have the groups list... */
        if (Array.isArray(this.allGroupList)) {
            /* Loop groups. */
            for (let index in this.allGroupList) {
                /* Sort group data. */
                let group = this.allGroupList[index];
                group = {
                    id: group.groupId,
                    text: group.groupName,
                };

                /* Push into correct filtered list. */
                if (this.allGroupList[index].groupIsTx) {
                    this.filteredTxGroupsList.push(group);
                } else {
                    this.filteredAdminGroupsList.push(group);
                }
            }
        }
    }

    /**
     * Convert Groups To Array
     * ---------------
     * Converts an object that holds objects in keys into an array of those same
     * objects.
     *
     * @param {obj} object - the object to be converted.
     *
     * @return {void}
     */
    public convertGroupsToArray(obj): Array<any> {
        let i = 0, key, newArray = [];
        for (key in obj) {
            /* Push the new object. */
            newArray.push(obj[key]);

            /* Index for tab control. */
            newArray[newArray.length - 1].index = i++;

            /* Make these all admin type groups. */
            newArray[newArray.length - 1].category = this.userAdminService.resolveGroupType({id: obj[key].groupIsTx});
            if (!newArray[newArray.length - 1].category.length) newArray[newArray.length - 1].category = [{text: 'No group.'}];
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
        const thisTab = this.tabsControl[tabid];
        /* Sort the data structure out. */
        let
            newUser = thisTab.formControl.value;

        newUser.userType = (newUser.userType.length ? newUser.userType[0].id : 0);
        newUser.accountType = (newUser.accountType.length ? newUser.accountType[0].id : 0);

        /* Let's trigger the creation of the user. */
        this.userAdminService.createNewUser(newUser).then((response) => {
            /* Now we've edited the user, we need to send any changes to the groups, wallet access and chain access. */
            let userId = response[1].Data[0].userID.toString();

            /* Save admin group access. */
            this.userAdminService.updateUserGroups({
                userId: userId,
                toAdd: this.arrayToGroups(newUser.adminGroups),
                toDelete: [],
                chainId: '0'
            }).then((response) => {
                /* Stub. */
            }).catch((error) => {
                /* Handle Error. */
                this.showError('Failed to update this user\'s administrative groups.');
            })

            /* Save tx group access. */
            this.userAdminService.updateUserGroups({
                userId: userId,
                toAdd: this.arrayToGroups(newUser.txGroups),
                toDelete: [],
                chainId: thisTab['selectedChain']
            }).then((response) => {
                /* Stub. */
            }).catch((error) => {
                /* Handle Error. */
                this.showError('Failed to update this user\'s transactional groups.');
            });

            /* Save wallet access. */
            this.userAdminService.newUserWalletPermissions({
                userId: userId,
                walletAccess: this.getWalletAccessFromTab(newUser),
            }).then((response) => {
                /* Stub. */
            }).catch((error) => {
                /* Handle Error. */
                this.showError('Failed to update this user\'s wallet permissions.');
            });

            /* Save the chain access. */
            this.userAdminService.updateUserChainAccess({
                userId: userId,
                toAdd: this.getChainAccessFromTab(newUser),
                toDelete: [],
            }).then((response) => {
                /* Stub. */
            }).catch((error) => {
                /* Handle Error. */
                this.showError('Failed to update this user\'s chain access.');
            });

            /* Clear the form. */
            this.clearNewUser(1, false);

            /* Handle success. */
            this.showSuccess('Successfully updated this user.');
        }).catch((error) => {
            /* Handle error. */
            this.showError('Failed to update this user.');
            console.warn('Failed to update this user: ', error);
        });

        /* Return. */
        return;
    }

    /**
     * Handle Edit User
     * ----------------
     * Handles saving an edited user.
     *
     * @param {tabid} number - The formcontrol obbject that relates
     * to this edit form tab.
     * @return {void}
     */
    public handleEditUser(tabid: number): void {
        const thisTab = this.tabsControl[tabid];

        /* Sort the data structure out. */
        let formData = thisTab.formControl.value;
        let dataToSend = {
            'userId': thisTab.userId.toString(),
            'email': formData.email,
            'userType': formData.userType.length ? formData.userType[0].id : 0,
            'account': formData.accountType.length ? formData.accountType[0].id : 0,
            'status': 0
        };

        /* Let's send the edit request. */
        this.userAdminService.editUser(dataToSend).then((response) => {
            /* Now we've edited the user, we need to send any changes to the groups. */
            let
                adminGroupChanges = this.diffUserGroups(thisTab.oldAdminGroups, this.arrayToGroups(formData.adminGroups)),
                txGroupChanges = this.diffUserGroups(thisTab.oldTxGroups, this.arrayToGroups(formData.txGroups));

            /* Save admin group access. */
            this.userAdminService.updateUserGroups({
                userId: thisTab.userId.toString(),
                toAdd: adminGroupChanges.toAdd,
                toDelete: adminGroupChanges.toDelete,
                chainId: '0'
            }).then((response) => {
                console.log('updated user admin groups.', response);
            }).catch((error) => {
                console.log('error updating user admin groups.', error);
                this.showError('Failed to update this user\'s administrative groups.');
            })

            /* Save tx group access. */
            this.userAdminService.updateUserGroups({
                userId: thisTab.userId.toString(),
                toAdd: txGroupChanges.toAdd,
                toDelete: txGroupChanges.toDelete,
                chainId: thisTab['selectedChain']
            }).then((response) => {
                console.log('updated user tx groups.', response);
            }).catch((error) => {
                console.log('error updating user tx groups.', error);
                this.showError('Failed to update this user\'s transactional groups.');
            })

            /* Save wallet access, first diff, then set the new ones to the old ones. */
            let
                newWalletAccess = this.getWalletAccessFromTab(formData),
                diffWalletAccess = this.userAdminService.getWalletAccessDiff(
                    thisTab['oldWalletAccess'],
                    newWalletAccess
                );
            this.userAdminService.updateUserWalletPermissions({
                userId: thisTab.userId.toString(),
                toAdd: diffWalletAccess.toAdd,
                toUpdate: diffWalletAccess.toUpdate,
                toDelete: diffWalletAccess.toDelete,
            }).then((response) => {
                /* Overwrite the old permissions, to allow diffing. */
                console.log('updated user wallet permissions.', response);
                thisTab['oldWalletAccess'] = newWalletAccess;
            }).catch((error) => {
                console.log('error updating user wallet permissions.', error);
                this.showError('Failed to update this user\'s wallet permissions.');
            });

            /* Now we'll save chain access, first get the diffs. */
            let
                newChainAccess = this.getChainAccessFromTab(formData),
                diffChainAccess = this.diffChainAccess(
                    thisTab['oldChainAccess'],
                    newChainAccess
                );
            this.userAdminService.updateUserChainAccess({
                userId: thisTab.userId.toString(),
                toAdd: diffChainAccess.toAdd,
                toDelete: diffChainAccess.toDelete,
            }).then((response) => {
                /* Overwrite the old permissions, to allow diffing future changes. */
                thisTab['oldChainAccess'] = newChainAccess.map(chain => {
                    return {
                        id: chain.chainId,
                        text: chain.chainName
                    }
                });
                console.log('updated user chain access: ', response);
            }).catch((error) => {
                console.log('error updating user wallet permissions.', error);
                this.showError('Failed to update this user\'s wallet permissions.');
            });

            /* Handle success message. */
            console.log('Successfully edited user.', response);
            this.showSuccess('Successfully updated user details.');
        }).catch((error) => {
            /* Handle error message. */
            console.log('Failed to edit user.', error);
            this.showError('Failed to update user details.');
        });

        /* Return */
        return;
    }

    private diffChainAccess(oldAccessArr, newAccessArr): any {
        /* Convert the arrays to objects. */
        let
            oldAccess = {},
            newAccess = {};
        oldAccessArr.map(chain => {
            oldAccess[chain.id] = chain
        });
        newAccessArr.map(chain => {
            newAccess[chain.chainId] = chain
        });

        /* Variables. */
        let
            i, j, res,
            differences = {
                toAdd: [],
                toDelete: []
            }

        /* First, let's see what's new. */
        for (i in newAccess) {
            /* If it's not in the old one, the add it. */
            if (!oldAccess[i]) {
                res = this.getChainById(newAccess[i].chainId);
                differences.toAdd.push(res);
            }
        }

        /* Lastly, let's check if any were deleted. */
        for (j in oldAccess) {
            /* If it's not in the new access, it's been deleted. */
            if (!newAccess[j]) {
                res = this.getChainById(oldAccess[j].id);
                differences.toDelete.push(res);
            }
        }

        /* Return. */
        return differences;
    }

    private diffUserGroups(oldGroups, newGroups): { toAdd: Array<{}>, toDelete: Array<{}> } {
        /* Variables. */
        let
            key, groupFetch,
            toAdd = [],
            toDelete = [];

        /* Get the removed ones. */
        for (key in oldGroups) {
            if (!newGroups[key]) toDelete.push(oldGroups[key]);
        }

        /* Get the added ones. */
        for (key in newGroups) {
            if (!oldGroups[key]) {
                groupFetch = this.getGroupById(newGroups[key].groupId);
                if (groupFetch.groupId) toAdd.push(groupFetch);
            }
        }

        /* Return. */
        return {toAdd, toDelete};
    }

    private getWalletAccessFromTab(formData): { [walletId: number]: number } {
        /* Object of changes. */
        let i, j, walletAccess = {};

        /* Get each wallet and push into wallet access. */
        for (i in formData['walletsRead']) {
            walletAccess[formData['walletsRead'][i].id] = 1;
        }

        for (j in formData['walletsFull']) {
            walletAccess[formData['walletsFull'][j].id] = 3;
        }

        /* Return. */
        return walletAccess;
    }

    private getChainAccessFromTab(formData): any {
        /* Object of changes. */
        let i, resolution, chainAccess = [];

        /* Get each wallet and push into wallet access. */
        for (i in formData['chainAccess']) {
            resolution = this.getChainById(formData['chainAccess'][i].id);
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
        for (let key in this.allGroupList) {
            if (this.allGroupList[key].groupId == id) {
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
        for (let key in this.chainList) {
            if (this.chainList[key].chainId == id) {
                return this.chainList[key];
            }
        }

        /* ...else return nothing. */
        return {};
    }

    /**
     * Get Wallet By Id
     * ---------------
     * Get a full wallet object by Id.
     *
     * @param  {id} number - th group id.
     * @return {void}
     */
    public getWalletById(id) {
        /* Look for the wallet and return it... */
        for (let key in this.manageWalletList) {
            if (this.manageWalletList[key].walletId == id) {
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
    public handleDelete(deleteUserIndex): void {
        /* Get the user's data. */
        let dataToSend = {};
        dataToSend['userId'] = this.usersList[deleteUserIndex].userID;
        dataToSend['account'] = this.usersList[deleteUserIndex].accountID;

        /* Send the request. */
        /* Let's now ask the user if they're sure... */
        this._confirmationService.create(
            '<span>Deleting a User</span>',
            '<span>Are you sure you want to delete \'' + this.usersList[deleteUserIndex].userName + '\'?</span>'
        ).subscribe((ans) => {
            /* ...if they are... */
            if (ans.resolved) {
                /* ...now send the request. */
                this.userAdminService.deleteUser(dataToSend).then((response) => {
                    /* Close any tabs open for this wallet. */
                    for (let i in this.tabsControl) {
                        if (this.tabsControl[i].userID == dataToSend['userId']) {
                            this.closeTab(i);
                            break;
                        }
                    }

                    /* Handle success message. */
                    this.showSuccess('Successfully deleted user.');
                }).catch((error) => {
                    /* Handle error message. */
                    this.showError('Failed to delete user.');
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
     * @param {editUserIndex} number - The index of a wallet to be editted.
     *
     * @return {void}
     */
    public handleEdit(editUserIndex): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i].userId === this.usersList[editUserIndex].userID) {
                /* Found the index for that tab, lets activate it... */
                this.setTabActive(i);

                /* And return. */
                return;
            }
        }

        /* Let's fix some data. */
        let user = this.usersList[editUserIndex];
        let accountType = this.userAdminService.resolveAccountType({text: user.accountName});
        let userType = this.userAdminService.resolveUserType({id: user.userType});

        /* And push the tab into it's place. */
        this.tabsControl.push({
            "title": {
                "icon": "fa-user",
                "text": this.usersList[editUserIndex].userName
            },
            "userId": user.userID,
            "formControl": this.getNewUserFormGroup(),
            "oldAdminGroups": {},
            "oldTxGroups": {},
            "selectedChain": 0,
            "filteredTxList": [], // filtered groups of this chainid.
            "selectedTxList": [], // groups to show as selected.
            "allocatedTxList": [], // all groups assigned to the user.
            "filteredWalletsByAccount": [], // filtered wallets by account.
            "oldChainAccess": {},
            "active": false // this.editFormControls
        });

        /* Refence the new tab. */
        const thisTab = this.tabsControl[this.tabsControl.length - 1];
        const newTabId = this.tabsControl.length - 1;

        /* Now let's prefill the user's meta data. */
        thisTab.formControl.controls['username'].patchValue(user.userName);
        thisTab.formControl.controls['email'].patchValue(user.emailAddress);
        thisTab.formControl.controls['accountType'].patchValue(accountType);
        thisTab.formControl.controls['userType'].patchValue(userType);

        /* Get Admin permissions. */
        this.userAdminService.requestUserPermissions({
            entityId: user.userID,
            isTx: false,
        }).then((response) => {
            /* So now we can select the user's permissions. */
            const userAdminPermissions = this.usersPermissionsList['usersAdminPermissions'][user.userID] || {};

            /* Next we can set it to the old and current groups. */
            thisTab['oldAdminGroups'] = userAdminPermissions; // used to diff later.
            thisTab.formControl.controls['adminGroups'].patchValue(this.groupsToArray(userAdminPermissions));
        }).catch((error) => {
            /* handle the error message */
            console.log("Editing user, admin permissions error: ", error);
            this.showError('Failed to fetch this user\'s administrative permissions.');
        });

        /* Get Tx permissions. */
        this.userAdminService.requestUserPermissions({
            entityId: user.userID,
            isTx: true,
        }).then((response) => {
            /* So now we can select the user's permissions. */
            const userTxPermissions = this.usersPermissionsList['usersTxPermissions'][user.userID] || {};

            /* Next we can set it to the old and allocatedTxList, which will be used on chain change. */
            thisTab['oldTxGroups'] = userTxPermissions; // used to diff later.
            thisTab['allocatedTxList'] = this.groupsToArray(userTxPermissions);

            /* Update the chain ID. */
            this.setFormChainId(newTabId, 0);
        }).catch((error) => {
            /* Handle the error message */
            console.log("Editing user, tx permissions error: ", error);
            this.showError('Failed to fetch this user\'s transactional permissions.');
        });

        this.userAdminService.requestUserWalletPermissions({
            'userId': user.userID,
        }).then((response) => {
            /* So now, we have access to the data in redux. */
            const userWalletPermissions = this.usersWalletPermissions[user.userID] || {};
            thisTab['oldWalletAccess'] = {};
            console.log('Got user wallet permission: ', userWalletPermissions);

            /* So first let's set the account ID on the tab... */
            this.setFormAccountId(newTabId, accountType[0]);

            /* If this user has no wallet permissions... bail. */
            if (!Object.keys(userWalletPermissions).length) {
                return;
            }

            /* Set the old wallet access, this'll be used to diff later. */
            userWalletPermissions.map((wallet) => {
                /* Build the structure in the old  */
                thisTab['oldWalletAccess'][wallet.walletID] = wallet.permission;
            });

            /* ...then filter and preset the read wallets...  */
            let readAccessWallets = userWalletPermissions
                .filter(wallet => wallet.permission == 1)
                .map((wallet) => {
                    wallet = this.getWalletById(wallet.walletID);
                    return {
                        id: wallet.walletId,
                        text: wallet.walletName
                    }
                });
            thisTab.formControl.controls['walletsRead'].patchValue(readAccessWallets);

            /* ...and lastly the same for the full access wallets. */
            let fullAccessWallets = userWalletPermissions
                .filter(wallet => wallet.permission == 3)
                .map((wallet) => {
                    wallet = this.getWalletById(wallet.walletID);
                    return {
                        id: wallet.walletId,
                        text: wallet.walletName
                    }
                });
            thisTab.formControl.controls['walletsFull'].patchValue(fullAccessWallets);

        }).catch((error) => {
            /* Handle the error message */
            console.log("Editing user, wallet permission error: ", error);
            this.showError('Failed to fetch this user\'s wallet permissions.');
        });

        /* Now we need to get the user's wallet access. */
        this.userAdminService.requestUserChainAccess({
            userId: user.userID
        }).then((response) => {
            console.log('got chain access: ', response);
            /* So we've requested the data, now we can access it. */
            let resolution, userChainAccess = this.usersChainAccess[user.userID] || [];

            /* Let's tidy it up for the ng2-select and patch the value... */
            userChainAccess = userChainAccess.map((chain) => {
                resolution = this.getChainById(chain.chainID);
                console.log(resolution);
                return {
                    id: resolution.chainId,
                    text: resolution.chainName,
                };
            })
            /* Filter to remove chains that we can't see. */
                .filter(chain => !!chain.id);

            /* Set the past access and the form control value. */
            thisTab['oldChainAccess'] = userChainAccess;
            thisTab.formControl.controls['chainAccess'].patchValue(userChainAccess);
        }).catch((error) => {
            /* Handle the error message */
            console.log("Failed to fetch user's chain access: ", error);
            this.showError('Failed to fetch this user\'s chain access.');
        });

        /* Activate the new tab. */
        this.setTabActive(this.tabsControl.length - 1);

        /* Return. */
        return;
    }

    private groupsToArray(groupsObject) {
        /* Variables. */
        let key, resolution, newArr = [];

        /* Loop and fetch the rest of the data. */
        for (key in groupsObject) {
            resolution = this.userAdminService.resolveGroup({groupId: groupsObject[key].groupID})[0];
            if (resolution) {
                newArr.push({
                    id: resolution.groupId,
                    text: resolution.groupName,
                })
            }
        }

        /* Return. */
        return newArr;
    }

    private arrayToGroups(groupsArray) {
        /* Variables. */
        let i, resolution, newObject = {};

        /* Loop and fetch the rest of the data. */
        for (i in groupsArray) {
            resolution = this.userAdminService.resolveGroup({groupId: groupsArray[i].id})[0];
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
    public clearNewUser(tabid, event): void {
        /* Prevent submit. */
        if (event) event.preventDefault();

        /* Let's set all the values in the form controls. */
        this.tabsControl[tabid].formControl = this.getNewUserFormGroup();

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
    getNewUserFormGroup(): FormGroup {
        return new FormGroup(
            {
                "username": new FormControl('', [
                    Validators.required
                ]),
                "email": new FormControl('', [
                    Validators.required
                ]),
                "accountType": new FormControl([]),
                "userType": new FormControl([]),
                "password": new FormControl('', [
                    Validators.required
                ]),
                "adminGroups": new FormControl([]),
                "txGroups": new FormControl([]),
                "walletsFull": new FormControl([]),
                "walletsRead": new FormControl([]),
                "chainAccess": new FormControl([]),
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
    showError(message) {
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
    showWarning(message) {
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
