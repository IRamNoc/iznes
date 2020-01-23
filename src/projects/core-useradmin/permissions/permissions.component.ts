/* Core. */
import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';

import { NgRedux } from '@angular-redux/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { ClrDatagridStringFilterInterface } from '@clr/angular';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmationService, immutableHelper, LogService } from '@setl/utils';
import * as _ from 'lodash';
import { MultilingualService } from '@setl/multilingual';
import { permissionsListFieldsModel, permissionsListActionsModel, filters } from './permissions.model';

/* Internal. */
import { permissionGroupActions } from '@setl/core-store';

/* User Admin Service. */
import { UserAdminService } from '../useradmin.service';

/* Alerts and confirms. */
import { AlertsService } from '@setl/jaspero-ng2-alerts';

/* Persist service. */
import { PersistService } from '@setl/core-persist';

class TypeFilter implements ClrDatagridStringFilterInterface<any> {
    accepts(group: any, search: string): boolean {
        return group.category[0].text.toLowerCase().indexOf(search) >= 0;
    }
}

/* Decorator. */
@Component({
    selector: 'setl-admin-permissions',
    templateUrl: 'permissions.component.html',
    styleUrls: ['permissions.component.css'],
    providers: [UserAdminService, ToasterService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/* Class. */
export class AdminPermissionsComponent implements OnInit, AfterViewInit, OnDestroy {
    /* Tabs control */
    public tabsControl: any;
    public typeFilter = new TypeFilter();

    /* Account types select. */
    public groupTypes: any;

    /* Subs from service observables. */
    private subscriptions = {};

    /* Lists set by those observables. */
    public allGroupList: any; // All lists.
    public adminPermAreasList: any;
    public txPermAreasList: any;
    public menuPermAreasList: any;
    public permissionsList: any;

    /* The permission levels list. */
    permissionTxLevelsList = [];
    permissionLevelsList = [];
    menuPermissionLevelsList = [];

    /* Filtered areas list. */
    public filteredAdminAreaList = [];
    public filteredTxAreaList = [];
    public filteredMenuAreaList = [];

    public currentTab = '';
    public new = false;

    /* Datagrid */
    public permissionsListFieldsModel = permissionsListFieldsModel;
    public permissionsListActionsModel = permissionsListActionsModel;
    public datagridFilters = filters;

    /* Constructor. */
    constructor(private userAdminService: UserAdminService,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private ngRedux: NgRedux<any>,
                private confirmationService: ConfirmationService,
                private logService: LogService,
                private persistService: PersistService,
                public translate: MultilingualService,
    ) {
    }

    public ngOnInit() {
        /* Get User Types. */
        this.groupTypes = this.userAdminService.getGroupTypes();

        this.setInitialTabs();
        this.setPermissionLevelLists();

        /* Subscribe to the admin group list observable. */
        this.subscriptions['allGroupList'] = this.userAdminService.getGroupListSubject().subscribe((list) => {
            /* Get the tx group list too and merge it with the admin list. */
            this.allGroupList = this.convertGroupsToArray(list);

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Subscribe to the admin group list observable. */
        this.subscriptions['adminPermAreaList'] =
            this.userAdminService.getAdminPermAreaListSubject().subscribe((list) => {
                /* Set the list. */
                this.adminPermAreasList = list;

                /* Call to filter lists for UI. */
                this.filterAreaLists();

                /* Override the changes. */
                this.changeDetectorRef.detectChanges();
            });

        this.subscriptions['txPermAreaList'] = this.userAdminService.getTxPermAreaListSubject().subscribe((list) => {
            /* Set the list. */
            this.txPermAreasList = list;

            /* Call to filter lists for UI. */
            this.filterAreaLists();

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        this.subscriptions['menuPermAreaList'] =
            this.userAdminService.getMenuPermAreaListSubject().subscribe((list) => {
                /* Set the list. */
                this.menuPermAreasList = list;

                /* Call to filter lists for UI. */
                this.filterAreaLists();

                /* Override the changes. */
                this.changeDetectorRef.detectChanges();
            });

        this.subscriptions['permissionsList'] = this.userAdminService.getPermissionsListSubject().subscribe((list) => {
            /* Set the list. */
            this.permissionsList = list;

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        this.subscriptions['routeParam'] = this.route.params.subscribe((params: Params) => {
            const tabId = _.get(params, 'permissionid', 0);
            this.setTabActive(tabId);
            this.currentTab = tabId;
        });
    }

    setInitialTabs() {
        // Get opened tabs from redux store.
        const openedTabs = immutableHelper.get(this.ngRedux.getState(), ['userAdmin', 'permissionGroup', 'openedTabs']);

        if (_.isEmpty(openedTabs)) {
            /* Default tabs. */
            this.tabsControl = [
                {
                    title: {
                        icon: 'fa-search',
                        text: this.translate.translate('Search'),
                    },
                    groupId: -1,
                    active: true,
                },
                {
                    title: {
                        icon: 'fa-plus',
                        text: this.translate.translate('Add New Group'),
                    },
                    groupId: -1,
                    formControl: this.newAddGroupFormgroup(),
                    active: false,
                },
            ];

            return true;
        }

        this.tabsControl = openedTabs;
    }

    ngAfterViewInit(): void {
        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        /* Ask for update from the service above. */
        this.userAdminService.updateState();
    }

    public newAddGroupFormgroup(type: string = 'new') {
        /* Create the group. */
        const group = new FormGroup(
            {
                name: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required]),
                type: new FormControl([], [Validators.required]),
                permissions: new FormControl([]),
            },
        );

        /* Return the form group and watch it using the persistService. */
        if (type === 'new') {
            return group;
        }

        return group;
    }

    /**
     * Updates the filtered areas lists used by UI elements.
     *
     * @return {void}
     */
    private filterAreaLists(): void {
        /* Let's do admin areas first. */
        if (Array.isArray(this.adminPermAreasList)) {
            this.filteredAdminAreaList = this.adminPermAreasList.map(this.extractArea);
        }

        /* Then let's do the tx areas. */
        if (Array.isArray(this.txPermAreasList)) {
            this.filteredTxAreaList = this.txPermAreasList.map(this.extractArea);
        }

        /* And finally the menu areas. */
        if (Array.isArray(this.menuPermAreasList) && this.filteredMenuAreaList.length === 0) {
            this.filteredMenuAreaList = this.menuPermAreasList.map(this.extractAreaMenu);
        }
    }

    /**
     * Extracts an area from a more complex object.
     *
     * @param {area} - the complex area object.
     *
     * @return {extractedArea} - the less complex object.
     */
    private extractArea(area): { id: string, text: string } {
        /* Return a new object. */
        return {
            id: area.permissionID,
            text: area.permissionName,
        };
    }

    private extractAreaMenu(area): { id: string, text: string, parentID: string } {
        /* Return a new object. */
        return {
            id: area.permissionID,
            text: area.permissionName,
            parentID: area.parentID,
        };
    }

    /**
     * Converts an object that holds objects in keys into an array of those same objects.
     *
     * @param {obj} object - the object to be converted.
     *
     * @return {void}
     */
    public convertGroupsToArray(obj): any[] {
        let key;
        const newArray = [];

        for (key in obj) {
            /* Push the new object. */
            newArray.push(obj[key]);

            /* Index for tab control. */
            const index = newArray.length - 1;
            newArray[index].index = index;

            /* Make these all admin type groups. */
            newArray[index].category = this.userAdminService.resolveGroupType({ id: obj[key].groupIsTx });
            if (!newArray[index].category.length) {
                newArray[index].category = [{ text: 'No group.' }];
            }

            /* Set groupType prop for datagrid list */
            newArray[index].groupType = newArray[index].category[0].text;
        }

        return newArray;
    }

    /**
     * Deletes a group.
     *
     * @param {number} index - The index of the group to delete.
     *
     * @return {void}
     */
    public handleDelete(index): void {
        /* Find the group Id o that's to be deleted. */
        if (this.allGroupList[index]) {
            /* Build the request. */
            let tab;
            const request = {};
            request['groupId'] = this.allGroupList[index].groupId;

            /* Let's now ask the user if they're sure... */
            this.confirmationService.create(
                `<span>${this.translate.translate('Deleting a permission group')}</span>`,
                `<span class="text-warning">${this.translate.translate(
                    'Are you sure you want to delete @groupName@?',
                    { groupName: this.allGroupList[index].groupName })}</span>`,
            ).subscribe((ans) => {
                /* ...if they are... */
                if (ans.resolved) {
                    /* ...now send the request. */
                    this.userAdminService.deleteGroup(request).then(() => {
                        /* Close any edit tabs created for this group. */
                        for (tab in this.tabsControl) {
                            if (this.tabsControl[tab].groupId === this.allGroupList[index].groupId) this.closeTab(tab);
                        }

                        /* Handle success. */
                        this.alertsService.generate(
                            'success',
                            this.translate.translate('Successfully deleted permission group.'),
                        );
                    }).catch((error) => {
                        /* Handle error. */
                        this.alertsService.generate(
                            'error',
                            this.translate.translate('Failed to delete permission group.'),
                        );
                        this.logService.log('Failed to delete permission group: ', error);
                    });
                }
            });
        }

        return;
    }

    /**
     * Handles clicks on action buttons on the datagrid
     * @param action
     */
    onAction(action) {
        if (action.type === 'editPermission') this.handleEdit(action.data.index);
        if (action.type === 'deletePermission') this.handleDelete(action.data.index);
    }

    /**
     * Handles the creation of a new tab with a new group form for a dynamic edit form tab.
     *
     * @param {number} index - The index of the group to edit.
     *
     * @return {void}
     */
    public handleEdit(index): void {
        /* Check if the tab is already open. */
        let i;
        let foundTabId = 0;
        let newTabId;

        for (i = 0; i < this.tabsControl.length; i += 1) {
            if (this.tabsControl[i].groupId === this.allGroupList[index].groupId) {
                foundTabId = i;
            }
        }

        const group = this.allGroupList[index];

        if (!foundTabId) {
            /* And also prefill the form... let's sort some of the data out. */
            this.tabsControl.push({
                title: {
                    icon: 'fa-pencil',
                    text: this.allGroupList[index].groupName,
                },
                groupIndex: index,
                groupId: group.groupId,
                formControl: new FormGroup(
                    {
                        name: new FormControl(group.groupName, [Validators.required]),
                        description: new FormControl(group.groupDescription, [Validators.required]),
                        type: new FormControl({ value: group.category, disabled: false }),
                        permissions: new FormControl([]),
                    },
                ),
                permissionsEmitter: new EventEmitter(), // This will be used to pass permissions in.
                active: false, // this.editFormControls
            });
            newTabId = this.tabsControl.length - 1;
        } else {
            newTabId = foundTabId;
        }

        /* Let's get the permission data. */
        this.userAdminService.requestPermissions({
            entityId: group.groupId,
            isGroup: 1,
            permissionId: 0, // get all.
            includeGroup: 0,  // not sure what this is.
            isTx: group.groupIsTx,
            chainId: 0,
        }).then(() => {
            /* Then let's find the tab and emit the data to the permission component using that event emitter. */
            let i;
            /* Figure out which call to make. */
            let location = 'adminPermissions';

            if (Number(group.groupIsTx) === 1) {
                location = 'transPermissions';
            } else if (Number(group.groupIsTx) === 2) {
                location = 'menuPermissions';
            }

            /* Loop over tabs and find this group tab. */
            for (i = 0; i < this.tabsControl.length; i += 1) {
                if (this.tabsControl[i].groupId === group.groupId) {
                    /* Get permissions or default to empty. */
                    let permissions = {};
                    if (this.permissionsList[location][group.groupId]) {

                        permissions = this.permissionsList[location][group.groupId];
                    }

                    /* Then patch the permissions value. */
                    this.tabsControl[i].permissionsEmitter.emit(permissions);
                    this.tabsControl[i].oldPermissions = permissions;

                    /* Then show the changes. */
                    this.changeDetectorRef.detectChanges();

                    break;
                }
            }
        });

        /* Activate the new tab. */
        this.router.navigateByUrl(`/user-administration/permissions/${newTabId}`);

        return;
    }

    /**
     * Handles saving a new group.
     *
     * @param {tabid}
     *
     * @return {void}
     */
    public handleNewGroup(tabid: number): void {
        /* Show a loading alert */
        this.alertsService.create('loading');

        /*
         1. Create Group
         Let's sort the data structure for creating a new group.
         */
        const formData = this.tabsControl[tabid].formControl.value;
        const dataToSend = {};

        const acceptedTypes = ['0', '1', '2'];

        /* Assign the data to send. */
        dataToSend['name'] = formData.name;
        dataToSend['description'] = formData.description;
        dataToSend['type'] = acceptedTypes.indexOf(formData.type[0].id) === -1 ? '0' : formData.type[0].id;

        /* Let's trigger the creation of the group. */
        this.userAdminService.createNewGroup(dataToSend).then((response) => {
            /* Implement a success message for creating the group. */
            /*
             2. Update permissions for this group.
             Let's build the data structure again.
             */
            const permissionsData = {};
            // Tidy up the permissions to be acceptable for the update call.
            const permissionsReformed = formData['permissions'];

            /* Assign all the data. */
            permissionsData['entityId'] = response[1].Data[0].groupID;
            permissionsData['isGroup'] = 1;
            permissionsData['toAdd'] = permissionsReformed;
            permissionsData['toUpdate'] = {}; // we're only adding as we're creating.
            permissionsData['toDelete'] = []; // we're only adding as we're creating.

            /* Figure out which function to call. */
            let functionCall = 'updateAdminPermissions';

            if (Number(dataToSend['type']) === 1) {
                functionCall = 'updateTxPermissions';
            } else if (Number(dataToSend['type']) === 2) {
                functionCall = 'updateMenuPermissions';
            }

            /* Then send the request. */
            this.userAdminService[functionCall](permissionsData).then((response) => {
                this.logService.log('Set new group permissions.', response);
            }).catch((error) => {
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to create this permission group.'),
                );
                this.logService.log('Failed to set new group permissions.', error);
            });

            /* Clear the form. */
            this.clearNewGroup(1, false); // send false in to disable the preventDefault.

            /* Success message. */
            this.subscriptions['newGroupSuccessAlert'] =
                this.alertsService.generate(
                    'success',
                    this.translate.translate('Successfully created group.')).subscribe(() => {
                    if (tabid > 1) {
                        this.closeTab(tabid);
                    }
                });
        }).catch((error) => {
            /* Implement an error message for failing to create the group. */
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to create this permission group.'),
            );
            this.logService.log('Failed to create new group.', error);
        });

        return;
    }

    /**
     * Handles updating a group.
     *
     * @param {tabid}
     *
     * @return {void}
     */
    public handleEditGroup(tabid: number): void {
        /* Show a loading alert */
        this.alertsService.create('loading');

        /*
         1. Update Group
         Let's sort the data structure for the edit group call.
         */
        const formData = this.tabsControl[tabid].formControl.value;
        const dataToSend = {};

        /* Assign the data to send. */
        dataToSend['groupId'] = this.tabsControl[tabid].groupId;
        dataToSend['name'] = formData.name;
        dataToSend['description'] = formData.description;
        dataToSend['type'] = formData.type[0] ? formData.type[0].id : 0;

        /* Let's trigger the creation of the group. */
        this.userAdminService.updateGroup(dataToSend).then((response) => {
            /*
             2. Update permissions for this group.
             Let's build the data structure again.
             */
            const permissionsData = {};
            const oldPermissions = this.tabsControl[tabid].oldPermissions;
            const newPermissions = formData.permissions;

            /* Tidy up the permissions to be acceptable for the update call. */
            const differences = this.userAdminService.getPermissionsDiff(
                oldPermissions,
                newPermissions,
                dataToSend['type'],
            );

            /* Assign all the data. */
            permissionsData['entityId'] = dataToSend['groupId'];
            permissionsData['isGroup'] = 1;
            permissionsData['chainId'] = 0;
            permissionsData['toAdd'] = differences['toAdd'];
            permissionsData['toUpdate'] = differences['toUpdate'];
            permissionsData['toDelete'] = differences['toDelete'];

            /* Figure out which call to make. */
            let functionCall = 'updateAdminPermissions';

            if (Number(dataToSend['type']) === 1) {
                functionCall = 'updateTxPermissions';
            } else if (Number(dataToSend['type']) === 2) {
                functionCall = 'updateMenuPermissions';
            }

            /* Send the request. */
            this.userAdminService[functionCall](permissionsData).then((response) => {
                /* Re-emit the permissions. */
                this.tabsControl[tabid].permissionsEmitter.emit(newPermissions);

                /* Make the old permissions the new ones so the user can revert them and have differences to send. */
                this.tabsControl[tabid].oldPermissions = newPermissions;
            }).catch((error) => {
                console.warn('Failed to update the group permissions.', error);
                this.alertsService.generate(
                    'error',
                    this.translate.translate('Failed to update this permission group.'),
                );
            });

            /* Success message. */
            this.subscriptions['updateGroupSuccessAlert'] =
                this.alertsService.generate(
                    'success',
                    this.translate.translate('Successfully updated this permission group.')).subscribe(() => {
                    this.closeTab(tabid);
                });
        }).catch((response) => {
            /* Implement an error message for failing to update the group. */
            console.warn('Failed to update the group.', response);
            this.alertsService.generate(
                'error',
                this.translate.translate('Failed to update this permission group.'),
            );
        });

        /* Clear the form. */
        // this.clearNewGroup(1, false); // send false in to disable the preventDefault.
        return;
    }

    /**
     * Clears the new group form, i.e., sets all inputs to not filled.
     *
     * @param {number} tabId - The tab to clear (will always be 1).
     *
     * @return {void}
     */
    public clearNewGroup(tabId, event): void {
        /* Prevent submit. */
        if (event) event.preventDefault();

        /* Let's set all the values in the form controls. */
        this.tabsControl[tabId].formControl = this.newAddGroupFormgroup('clear');

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        return;
    }

    /**
     * Converts the object of updated permissions into grouped levels then by IDs and their value.
     *
     * @param {object} permissions - The permissions object from the form.
     *
     * @return {object} - An object detailing permissions by level then key pairs of ID and value.
     */
    public extractPermissionsToUpdate(permissions): any {
        let i;
        let permissionLevel;
        let permissionID;
        const newStructure = {};

        /* Firstly, lets loop over the permission levels and create an array for each. */
        for (i = 0; i < this.permissionLevelsList.length; i += 1) {
            permissionLevel = this.permissionLevelsList[i].id;

            /* Set the empty object. */
            newStructure[permissionLevel] = {};
        }

        /* Now let's loop over each permission and assign it's ID to any object it should be in.  */
        for (permissionID in permissions) {
            for (i = 0; i < this.permissionLevelsList.length; i += 1) {
                permissionLevel = this.permissionLevelsList[i].id;

                /* Assign the permission ID with the level's value. */
                newStructure[permissionLevel][permissionID] = permissions[permissionID][permissionLevel];
            }
        }

        return newStructure;
    }

    /**
     * Removes a tab from the tabs control array, in effect, closing it.
     *
     * @param {number} index - the tab inded to close.
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

        /* Reset tabs. SetTimeout needed to make navigateByUrl work after closing an alert */
        setTimeout(
            () => {
                this.router.navigateByUrl('/user-administration/permissions/0');
            },
            0,
        );

        return;
    }

    /**
     * Sets all tabs to inactive other than the given index, this means the view is switched to the wanted tab.
     *
     * @param {number} index - The tab inded to close.
     *
     * @return {void}
     */
    public setTabActive(index: number = 0) {
        this.tabsControl = immutableHelper.map(this.tabsControl, (item, thisIndex) => {
            return item.set('active', thisIndex === Number(index));
        });
    }

    private setPermissionLevelLists() {
        this.permissionTxLevelsList = this.translate.translate([
            {
                id: 'canDelegate',
                text: 'Delegate',
            },
            {
                id: 'canRead',
                text: 'Read',
            },
            {
                id: 'canInsert',
                text: 'Insert',
            },
        ]);

        this.permissionLevelsList = this.translate.translate([
            {
                id: 'canDelegate',
                text: 'Delegate',
            },
            {
                id: 'canRead',
                text: 'Read',
            },
            {
                id: 'canInsert',
                text: 'Insert',
            },
            {
                id: 'canUpdate',
                text: 'Update',
            },
            {
                id: 'canDelete',
                text: 'Delete',
            },
        ]);

        this.menuPermissionLevelsList = this.translate.translate([
            {
                id: 'topProfileAccess',
                text: 'Top - Profile Access',
            },
            {
                id: 'sideAccess',
                text: 'Side Access',
            },
            {
                id: 'disabledAccess',
                text: 'Disable Access',
            },
        ]);
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsubscribe all Observables. */
        let key;
        for (key in this.subscriptions) {
            if (this.subscriptions[key].unsubscribe) {
                this.subscriptions[key].unsubscribe();
            }
        }

        this.ngRedux.dispatch(permissionGroupActions.setAllTabs(this.tabsControl));
    }
}
