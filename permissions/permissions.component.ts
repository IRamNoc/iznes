/* Core imports. */
import {Component, ChangeDetectorRef, AfterViewInit, OnDestroy} from '@angular/core';
import { FormsModule, FormGroup, FormControl, NgModel } from '@angular/forms';
import {ToasterService, ToasterContainerComponent} from 'angular2-toaster';

/* User Admin Service. */
import {UserAdminService} from '../useradmin.service';

/* Decorator. */
@Component({
    selector: 'setl-admin-permissions',
    templateUrl: 'permissions.component.html',
    styleUrls: [ 'permissions.component.css' ],
    providers: [ UserAdminService, ToasterService ]
})

/* Class. */
export class AdminPermissionsComponent implements AfterViewInit, OnDestroy {
    /* Group list. */
    public adminGroupList:any;

    /* Tabs control */
    public tabsControl:any;

    /* Account types select. */
    public groupTypes:any;

    /* Subscriptions from service observables. */
    private adminGroupListSubscription:any;

    /* Constructor. */
    constructor (
        private userAdminService:UserAdminService,
        private changeDetectorRef:ChangeDetectorRef
    ) {
        /* Get User Types. */
        this.groupTypes = userAdminService.getGroupTypes();

        /* Subscribe to the admin group list observable. */
        this.adminGroupListSubscription = this.userAdminService.getAdminGroupListSubject().subscribe((list) => {
            this.adminGroupList = this.convertAdminGroupsToArray(list);

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
                        "type": new FormControl( [] )
                    }
                ),
                "active": false
            }
        ]
    }

    /* Handles a ng2-select selection. */
    public selected(propertyName:string, value:any):void {
        this[propertyName] = value;
    }

    /* Handles a ng2-select deletion. */
    public removed(propertyName:string, value:any):void {
        this[propertyName] = undefined;
    }

    ngAfterViewInit() {
        /* Override the changes. */
        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy ():void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        this.adminGroupListSubscription.unsubscribe();
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
            newArray[ newArray.length - 1 ].category = 1;
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
         if ( ! this.adminGroupList.length || ! index ) {
             return;
         }

         /* Set the array to an identical array, lacking the asked index. */
         this.adminGroupList = [
             ...this.adminGroupList.slice(0, index - 1),
             ...this.adminGroupList.slice(index, this.adminGroupList.length)
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
             if ( this.tabsControl[i].groupId === this.adminGroupList[index].groupId ) {
                 /* Found the index for that tab, lets activate it... */
                 this.setTabActive(i);

                 /* And return. */
                 return;
             }
         }

         /* Push the edit tab into the array. */
         let group = this.adminGroupList[index];
         console.log( "GROUP: ", group);
         let groupType = [{ id: group.groupId, text: group.groupName }];

         /* And also prefill the form... let's sort some of the data out. */
         this.tabsControl.push({
             "title": "<i class='fa fa-pencil'></i> "+ this.adminGroupList[ index ].groupName,
             "groupId": group.userId,
             "formControl": new FormGroup(
                 {
                     "name": new FormControl( group.groupName ),
                     "description": new FormControl( group.groupDescription ),
                     "type": new FormControl( groupType )
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
                 "type": new FormControl( [] )
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

}
