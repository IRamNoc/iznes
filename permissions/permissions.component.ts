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

    public permissionsData:any = [];

    public tabsControl:any;

    /* Account types select. */
    public groupTypes:any;

    /* Constructor. */
    constructor (
        private userAdminService:UserAdminService,
        private changeDetectorRef:ChangeDetectorRef
    ) {
        /* Get User Types. */
        this.groupTypes = userAdminService.getGroupTypes();

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
        console.log( "detaching change detector." );
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
         if ( ! this.permissionsData.length || ! index ) {
             return;
         }

         /* Set the array to an identical array, lacking the asked index. */
         this.permissionsData = [ ...this.permissionsData.slice(0, index - 1), ...this.permissionsData.slice(index, this.permissionsData.length) ];

         /* Return. */
         return;
     }

     /**
      * Handle Edit
      * Edits a group.
      *
      * @param {index}
      * @return {void}
      */
     public handleEdit (index):void {
         /* Console log */
         console.log( "Editting "+ index );

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
