/* Core imports. */
import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy,
    OnInit
} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {FormControl, FormGroup} from '@angular/forms';
import {ToasterService} from 'angular2-toaster';
import {ClrDatagridStringFilterInterface} from "@clr/angular";
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ConfirmationService, immutableHelper} from '@setl/utils';
import * as _ from 'lodash';
import {permissionGroupActions} from '@setl/core-store';
/* User Admin Service. */
import {UserAdminService} from '../useradmin.service';
/* Use the permissions grid. */
/* Alerts and confirms. */
import {AlertsService} from '@setl/jaspero-ng2-alerts';
/* Persist service. */
import {PersistService} from "@setl/core-persist";

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
    changeDetection: ChangeDetectionStrategy.OnPush
})

/* Class. */
export class AdminPermissionsComponent implements OnInit, AfterViewInit, OnDestroy {
    /* Tabs control */
    public tabsControl: any;
    public typeFilter = new TypeFilter();

    /* Account types select. */
    public groupTypes: any;

    /* Subs from service observables. */
    private adminGroupListSub: any;
    private adminPermAreaListSub: any;
    private txPermAreaListSub: any;
    private subscriptions = {};

    /* Lists set by thos observables. */
    public allGroupList: any; // All lists.
    public adminPermAreasList: any;
    public txPermAreasList: any;
    public permissionsList: any;

    /* The permission levels list. */
    public permissionLevelsList = [
        {
            'id': 'canDelegate',
            'text': 'Delegate'
        },
        {
            'id': 'canRead',
            'text': 'Read'
        },
        {
            'id': 'canInsert',
            'text': 'Insert'
        },
        {
            'id': 'canUpdate',
            'text': 'Update'
        },
        {
            'id': 'canDelete',
            'text': 'Delete'
        },
    ];

    /* Filtered areas list. */
    public filteredAdminAreaList = [];
    public filteredTxAreaList = [];

    /* Constructor. */
    constructor(private userAdminService: UserAdminService,
                private changeDetectorRef: ChangeDetectorRef,
                private alertsService: AlertsService,
                private route: ActivatedRoute,
                private router: Router,
                private ngRedux: NgRedux<any>,
                private _confirmationService: ConfirmationService,
                private _persistService: PersistService) {
        /* Stub. */
    }

    public ngOnInit() {
        /* Get User Types. */
        this.groupTypes = this.userAdminService.getGroupTypes();

        this.setInitialTabs();

        /* Subscribe to the admin group list observable. */
        this.subscriptions['allGroupList'] = this.userAdminService.getGroupListSubject().subscribe((list) => {
            /* Get the tx group list too and merge it with the admin list. */
            this.allGroupList = this.convertGroupsToArray(list);

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Subscribe to the admin group list observable. */
        this.subscriptions['adminPermAreaList'] = this.userAdminService.getAdminPermAreaListSubject().subscribe((list) => {
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

        this.subscriptions['permissionsList'] = this.userAdminService.getPermissionsListSubject().subscribe((list) => {
            /* Set the list. */
            this.permissionsList = list;

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        this.subscriptions['routeParam'] = this.route.params.subscribe((params: Params) => {
            const tabId = _.get(params, 'permissionid', 0);
            this.setTabActive(tabId);
        });
    }

    setInitialTabs() {
        // Get opened tabs from redux store.
        const openedTabs = immutableHelper.get(this.ngRedux.getState(), ['userAdmin', 'permissionGroup', 'openedTabs']);

        if (_.isEmpty(openedTabs)) {
            /* Default tabs. */
            this.tabsControl = [
                {
                    "title": {
                        "icon": "fa-search",
                        "text": "Search"
                    },
                    "groupId": -1,
                    "active": true
                },
                {
                    "title": {
                        "icon": "fa-plus",
                        "text": "Add New Group"
                    },
                    "groupId": -1,
                    "formControl": this.newAddGroupFormgroup(),
                    "active": false
                }
            ];
            return true;
        }

        this.tabsControl = openedTabs;
        this.tabsControl[1].formControl = this._persistService.watchForm('useradmin/newGroup', this.tabsControl[1].formControl);
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
                "name": new FormControl(''),
                "description": new FormControl(''),
                "type": new FormControl([]),
                "permissions": new FormControl([])
            }
        );

        /* Return the form group and watch it using the persistService. */
        if (type === 'new') {
            return this._persistService.watchForm('useradmin/newGroup', group);
        } else {
            return group;
        }
    }

    /**
     * Filter Area Lists
     * -----------------
     * Updates the filtered areas lists used by UI elements.
     *
     * @return {void}
     */
    private filterAreaLists(): void {
        /* Let's do admin areas first. */
        if (Array.isArray(this.adminPermAreasList)) {
            this.filteredAdminAreaList = this.adminPermAreasList.map(this.extractArea)
        }

        /* Then let's do the tx areas. */
        if (Array.isArray(this.txPermAreasList)) {
            this.filteredTxAreaList = this.txPermAreasList.map(this.extractArea);
        }
    }

    /**
     * Extract area
     * ------------
     * Extracts an area from a more complex object.
     *
     * @param {area} - the complex area object.
     *
     * @return {extractedArea} - the less complex object.
     */
    private extractArea(area): { id: string, text: string } {
        /* Return a new object. */
        return {
            'id': area.permissionID,
            'text': area.permissionName
        };
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
            if (!newArray[newArray.length - 1].category.length) {
                newArray[newArray.length - 1].category = [{text: 'No group.'}];
            }
        }
        return newArray;
    }

    /**
     * Handle Delete
     * Deletes a group.
     *
     * @param {index}
     * @return {void}
     */
    public handleDelete(index): void {
        /* Find the group Id o that's to be deleted. */
        if (this.allGroupList[index]) {
            /* Build the request. */
            let tab, request = {};
            request['groupId'] = this.allGroupList[index].groupId;

            /* Let's now ask the user if they're sure... */
            this._confirmationService.create(
                '<span>Deleting a permission group</span>',
                '<span>Are you sure you want to delete \'' + this.allGroupList[index].groupName + '\'?</span>'
            ).subscribe((ans) => {
                /* ...if they are... */
                if (ans.resolved) {
                    /* ...now send the request. */
                    this.userAdminService.deleteGroup(request).then(() => {
                        /* Close any edit tabs created for this group. */
                        for (tab in this.tabsControl) {
                            if (this.tabsControl[tab].groupId == this.allGroupList[index].groupId) this.closeTab(tab);
                        }

                        /* Handle success. */
                        this.showSuccess('Successfully deleted permission group');
                    }).catch((error) => {
                        /* Handle error. */
                        this.showError('failed to delete permission group');
                        console.log('Failed to delet permission group: ', error);
                    });
                }
            });
        }

        /* Return. */
        return;
    }

    /**
     * Handle Edit
     * -----------
     * Handles the creation of a new tab with a new group form for a dynamic
     * edit form tab.
     *
     * @param {index} - The index of which group we're editting.
     *
     * @return {void}
     */
    public handleEdit(index): void {
        /* Check if the tab is already open. */
        let i;
        for (i = 0; i < this.tabsControl.length; i++) {
            if (this.tabsControl[i].groupId === this.allGroupList[index].groupId) {
                /* Found the index for that tab, lets activate it... */
                this.router.navigateByUrl('/user-administration/' + i);

                /* And return. */
                return;
            }
        }

        /* Push the edit tab into the array. */
        let group = this.allGroupList[index];

        /* And also prefill the form... let's sort some of the data out. */
        this.tabsControl.push({
            "title": {
                "icon": "fa-pencil",
                "text": this.allGroupList[index].groupName,
            },
            "groupId": group.groupId,
            "formControl": new FormGroup(
                {
                    "name": new FormControl(group.groupName),
                    "description": new FormControl(group.groupDescription),
                    "type": new FormControl({value: group.category, disabled: false}),
                    "permissions": new FormControl([])
                }
            ),
            "permissionsEmitter": new EventEmitter(), // This will be used to pass permissions in.
            "active": false // this.editFormControls
        });

        console.log(group.groupIsTx);

        /* Let's get the permission data. */
        this.userAdminService.requestPermissions({
            entityId: group.groupId,
            isGroup: 1,
            permissionId: 0, // get all.
            includeGroup: 0,  // not sure what this is.
            isTx: group.groupIsTx === 1 ? true : false,
            chainId: 0,
        }).then(() => {
            /* Then let's find the tab and emit the data to the
             permission component using that event emitter. */
            let
                i,
                location = group.groupIsTx === 1 ? 'transPermissions' : 'adminPermissions';

            /* Loop over tabs and find this group tab. */
            for (i = 0; i < this.tabsControl.length; i++) {
                if (this.tabsControl[i].groupId === group.groupId) {
                    /* Get permissions or default to emtpy. */
                    let permissions = {};
                    if (this.permissionsList[location][group.groupId]) {
                        permissions = this.permissionsList[location][group.groupId];
                    }

                    /* Then patch the permissions value. */
                    this.tabsControl[i].permissionsEmitter.emit(permissions);
                    this.tabsControl[i].oldPermissions = permissions;

                    /* Then show the changes. */
                    this.changeDetectorRef.detectChanges();

                    /* Break. */
                    break;
                }
            }
        });

        /* Activate the new tab. */
        const newTabId = this.tabsControl.length - 1;
        this.router.navigateByUrl('/user-administration/permissions/' + newTabId);

        /* Return. */
        return;
    }

    /**
     * Handle New Group
     * ---------------
     * Handles saving a new group.
     *
     * @param {tabid}
     * @return {void}
     */
    public handleNewGroup(tabid: number): void {
        /*
         1. Create Group
         Let's sort the data structure for creating a new group.
         */
        let
            formData = this.tabsControl[tabid].formControl.value,
            dataToSend = {};

        /* Assign the data to send. */
        dataToSend['name'] = formData.name;
        dataToSend['description'] = formData.description;
        dataToSend['type'] = formData.type[0].id === '0' ? '0' : '1';

        /* Let's trigger the creation of the group. */
        this.userAdminService.createNewGroup(dataToSend).then((response) => {
            /* Implement a success message for creating the group. */
            /*
             2. Update permissions for this group.
             Let's build the data structure again.
             */
            let permissionsData = {},
                //  Tidy up the permissions to be acceptable for the update call.
                permissionsReformed = formData['permissions'];

            /* Assign all the data. */
            permissionsData['entityId'] = response[1].Data[0].groupID;
            permissionsData['isGroup'] = 1;
            permissionsData['toAdd'] = permissionsReformed;
            permissionsData['toUpdate'] = {}; // we're only adding as we're creating.
            permissionsData['toDelete'] = {}; // we're only adding as we're creating.

            /* Figure out which function to call. */
            let functionCall = dataToSend['type'] == 1 ? 'updateTxPermissions' : 'updateAdminPermissions';

            /* Then send the request. */
            this.userAdminService[functionCall](permissionsData).then((response) => {

                console.log('Set new group permissions.', response);
            }).catch((error) => {

                console.log('Failed to set new group permissions.', error);
            });

            /* Clear the form. */
            this.clearNewGroup(1, false); // send false in to disable the preventDefault.

            /* Success message. */
            this.showSuccess('Successfully created group');
        }).catch((error) => {
            /* Implement an error message for failing to create the group. */
            this.showError('Failed to update this permission group.');
            console.log("Failed to create new group.", error);
        });

        /* Return. */
        return;
    }

    /**
     * Handle Edit Group
     * ---------------
     * Handles updating a group.
     *
     * @param {tabid}
     * @return {void}
     */
    public handleEditGroup(tabid: number): void {
        /*
         1. Update Group
         Let's sort the data structure for the edit group call.
         */
        let
            formData = this.tabsControl[tabid].formControl.value,
            dataToSend = {};

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
            let
                permissionsData = {},
                oldPermissions = this.tabsControl[tabid].oldPermissions,
                newPermissions = formData.permissions;

            /* Tidy up the permissions to be acceptable for the update call. */
            let
                differences = this.userAdminService.getPermissionsDiff(
                    oldPermissions,
                    newPermissions
                );

            /* Assign all the data. */
            permissionsData['entityId'] = dataToSend['groupId'];
            permissionsData['isGroup'] = 1;
            permissionsData['chainId'] = 0;
            permissionsData['toAdd'] = differences['toAdd'];
            permissionsData['toUpdate'] = differences['toUpdate'];
            permissionsData['toDelete'] = differences['toDelete'];

            /* Figure out which call to make. */
            let functionCall = dataToSend['type'] == 1 ? 'updateTxPermissions' : 'updateAdminPermissions';

            /* Send the request. */
            this.userAdminService[functionCall](permissionsData).then((response) => {
                /* Re-emit the permissions. */
                this.tabsControl[tabid].permissionsEmitter.emit(newPermissions);

                /* Lastly, make the old permissions the new ones so the user can revert them and have differences to send. */
                this.tabsControl[tabid].oldPermissions = newPermissions;
            }).catch((error) => {
                console.warn("Failed to update the group permissions.", error);
            });

            /* Success message. */
            this.showSuccess('Successfully updated this permission group');
        }).catch((response) => {
            /* Implement an error message for failing to update the group. */
            console.warn("Failed to update the group.", response);
            this.showSuccess('Failed to update this permission group');
        });


        /* Clear the form. */
        //  this.clearNewGroup(1, false); // send false in to disable the preventDefault.

        /* Return. */
        return;
    }

    /**
     * Clear New Group
     * --------------
     * Clears the new group form, i.e, sets all inputs to not filled.
     *
     * @param {tabid} number - the tab to clear (will always be 1).
     *
     * @return {void}
     */
    public clearNewGroup(tabid, event): void {
        /* Prevent submit. */
        if (event) event.preventDefault();

        /* Let's set all the values in the form controls. */
        this.tabsControl[tabid].formControl = this.newAddGroupFormgroup();

        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        /* Return. */
        return;
    }

    /**
     * Extract Permissions to Update
     * -----------------------------
     * Converts the object of updated permissions into grouped levels then by
     * IDs and their value.
     *
     * @param {permissions} - the permissions object from the form.
     *
     * @return {levels} - and object detailing permissions by level then key
     * pairs of ID and value.
     */
    public extractPermissionsToUpdate(permissions): any {
        let
            i, permissionLevel, permissionID,
            newStructure = {};

        /* Firstly, lets loop over the permission levels and create an array
         for each. */
        for (i = 0; i < this.permissionLevelsList.length; i++) {
            permissionLevel = this.permissionLevelsList[i].id;

            /* Set the empty object. */
            newStructure[permissionLevel] = {};
        }

        /* Now let's loop over each permission and assign it's ID to any
         object it should be in.  */
        for (permissionID in permissions) {
            for (i = 0; i < this.permissionLevelsList.length; i++) {
                permissionLevel = this.permissionLevelsList[i].id;

                /* Assign the permission ID with the level's value. */
                newStructure[permissionLevel][permissionID] = permissions[permissionID][permissionLevel];
            }
        }

        /* Return. */
        return newStructure;
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
        this.router.navigateByUrl('/user-administration/0');

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

        /* Unsunscribe all Observables. */
        let key;
        for (key in this.subscriptions) {
            if (this.subscriptions[key].unsubscribe) {
                this.subscriptions[key].unsubscribe();
            }
        }

        this.ngRedux.dispatch(permissionGroupActions.setAllTabs(this.tabsControl));
    }
}
