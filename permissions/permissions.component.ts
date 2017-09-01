/* Core imports. */
import {Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy} from '@angular/core';
import { FormsModule, FormGroup, FormControl, NgModel } from '@angular/forms';
import {ToasterService, ToasterContainerComponent} from 'angular2-toaster';

/* User Admin Service. */
import {UserAdminService} from '../useradmin.service';

/* Use the permissions grid. */
import {PermissionGridComponent} from '@setl/permission-grid';

/* Decorator. */
@Component({
    selector: 'setl-admin-permissions',
    templateUrl: 'permissions.component.html',
    styleUrls: [ 'permissions.component.css' ],
    providers: [ UserAdminService, ToasterService ]
})

/* Class. */
export class AdminPermissionsComponent implements AfterViewInit, OnDestroy {
    /* Tabs control */
    public tabsControl:any;

    /* Account types select. */
    public groupTypes:any;

    /* Subs from service observables. */
    private adminGroupListSub:any;
    private adminPermAreaListSub:any;
    private txPermAreaListSub:any;

    /* Lists set by thos observables. */
    public allGroupList:any; // All lists.
    public adminPermAreasList:any;
    public txPermAreasList:any;

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

    /* Old areas list. */
    public filteredAdminAreaList = [];
    public filteredTxAreaList = [];

    /* Constructor. */
    constructor (
        private userAdminService:UserAdminService,
        private changeDetectorRef:ChangeDetectorRef
    ) {
        /* Get User Types. */
        this.groupTypes = userAdminService.getGroupTypes();

        /* Subscribe to the admin group list observable. */
        this.adminGroupListSub = this.userAdminService.getAdminGroupListSubject().subscribe((list) => {
            /* TODO - get the tx group list too and merge it with the admin list. */
            this.allGroupList = this.convertAdminGroupsToArray(list);

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Subscribe to the admin group list observable. */
        this.adminPermAreaListSub = this.userAdminService.getAdminPermAreaListSubject().subscribe((list) => {
            /* Set the list. */
            this.adminPermAreasList = list;

            /* Call to filter lists for UI. */
            this.filterAreaLists();

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        this.txPermAreaListSub = this.userAdminService.getTxPermAreaListSubject().subscribe((list) => {
            /* Set the list. */
            this.txPermAreasList = list;

            /* Call to filter lists for UI. */
            this.filterAreaLists();

            /* Override the changes. */
            this.changeDetectorRef.detectChanges();
        });

        /* Default tabs. */
        this.tabsControl = [
            {
                "title": "<i class='fa fa-search'></i> Search",
                "userId": -1,
                "active": true
            },
            {
                "title": "<i class='fa fa-plus'></i> Add New Group",
                "userId": -1,
                "formControl": new FormGroup(
                    {
                        "name": new FormControl(''),
                        "description": new FormControl(''),
                        "type": new FormControl( [] ),
                        "permissions": new FormControl([])
                    }
                ),
                "active": false
            }
        ]
    }

    ngAfterViewInit():void {
        /* Override the changes. */
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Filter Area Lists
     * -----------------
     * Updates the filtered lists used by UI elements.
     *
     * @return {void}
     */
    private filterAreaLists ():void {
        /* Let's do admin areas first. */
        if ( Array.isArray(this.adminPermAreasList) ) {
            this.filteredAdminAreaList = this.adminPermAreasList.map(this.extractArea)
        }

        /* Then let's do the tx areas. */
        if ( Array.isArray(this.txPermAreasList) ) {
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
    private extractArea (area):{id: string, text: string} {
        return {
            'id': area.permissionID,
            'text': area.permissionName
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
    public convertAdminGroupsToArray (obj):Array<any> {
        let i = 0, key, newArray = [];
        for (key in obj) {
            /* Push the new object. */
            newArray.push( obj[key] );

            /* Index for tab control. */
            newArray[ newArray.length - 1 ].index = i++;

            /* Make these all admin type groups. */
            newArray[ newArray.length - 1 ].category = this.userAdminService.resolveGroupType( { id: 1 } );
        }
        return newArray;
    }

    /**
     * Handle Save
     * Handles the user saving a group.
     *
     * @param {event}
     * @return {void}
     */
     public handleSave ( event ):void {
         /* Validate the group information. */

         /* Return. */
         return;
     }

     /**
      * Handle Delete
      * Deletes a group.
      *
      * @param {index}
      * @return {void}
      */
     public handleDelete (index):void {
         console.log( "Deleting "+ index );
         /* Check that the array has a length... */
         if ( ! this.allGroupList.length || ! index ) {
             return;
         }

         /* Set the array to an identical array, lacking the asked index. */
         this.allGroupList = [
             ...this.allGroupList.slice(0, index - 1),
             ...this.allGroupList.slice(index, this.allGroupList.length)
         ];

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
     public handleEdit (index):void {
         /* Check if the tab is already open. */
         let i;
         for ( i = 0; i < this.tabsControl.length; i++ ) {
             if ( this.tabsControl[i].groupId === this.allGroupList[index].groupId ) {
                 /* Found the index for that tab, lets activate it... */
                 this.setTabActive(i);

                 /* And return. */
                 return;
             }
         }

         /* Push the edit tab into the array. */
         let group = this.allGroupList[index];

         console.log( "EDITTING GROUP: ", group );

         /* And also prefill the form... let's sort some of the data out. */
         this.tabsControl.push({
             "title": "<i class='fa fa-pencil'></i> "+ this.allGroupList[ index ].groupName,
             "groupId": group.userId,
             "formControl": new FormGroup(
                 {
                     "name": new FormControl( group.groupName ),
                     "description": new FormControl( group.groupDescription ),
                     "type": new FormControl( group.category ),
                     "permissions": new FormControl([])
                 }
             ),
             "active": false // this.editFormControls
         });

         /* Activate the new tab. */
         this.setTabActive( this.tabsControl.length - 1 );

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
     public handleNewGroup (tabid:number):void {
         /* Sort the data structure out. */
         let
         formData = this.tabsControl[tabid].formControl.value,
         dataToSend = {};

         dataToSend['name'] = formData.name;
         dataToSend['description'] = formData.description;
         dataToSend['type'] = formData.description.type ? formData.description.type.id || 0 : 0;

         /* Let's trigger the creation of the user. */
        //  this.userAdminService.createNewUser(
        //      this.tabsControl[tabid].formControl.value
        //  );

        console.log( " | new group: ", dataToSend );

         /* Clear the form. */
         this.clearNewGroup(1, false); // send false in to disable the preventDefault.

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
     public clearNewGroup (tabid, event):void {
         /* Prevent submit. */
         if ( event ) event.preventDefault();

         /* Let's set all the values in the form controls. */
         this.tabsControl[tabid].formControl = new FormGroup(
             {
                 "name": new FormControl(''),
                 "description": new FormControl(''),
                 "type": new FormControl([]),
                 "permissions": new FormControl([])
             }
         );

         /* Override the changes. */
         this.changeDetectorRef.detectChanges();

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
    public closeTab (index) {
        /* Validate that we have index. */
        if ( ! index && index !== 0 ) {
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
      public setTabActive (index:number = 0) {
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

      ngOnDestroy ():void {
          /* Detach the change detector on destroy. */
          this.changeDetectorRef.detach();

          /* Unsunscribe Observables. */
          this.adminGroupListSub.unsubscribe();
          this.adminPermAreaListSub.unsubscribe();
      }
}
