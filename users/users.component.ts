/* Core imports. */
import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule, FormGroup, FormControl, NgModel } from '@angular/forms';

import { OnDestroy } from '@angular/core';

/* User Admin Service. */
import {UserAdminService} from '../useradmin.service';

/* Decorator. */
@Component({
    selector: 'setl-admin-users',
    templateUrl: 'users.component.html',
    styleUrls: [ 'users.component.css' ],
    providers: [ UserAdminService ]
})

/* Class. */
export class AdminUsersComponent implements AfterViewInit, OnDestroy {

    @ViewChild('usersDataGrid') usersDataGrid;

    /* User data. */
    public usersList:any;

    /* Tabs control */
    public tabsControl:any;

    /* Account types select. */
    public accountTypes:any;

    /* User types select. */
    public userTypes:any;

    /* Subscriptions from service observables. */
    private userListSubscription:any;

    /* Constructor. */
    constructor (
        private userAdminService:UserAdminService,
        private changeDetectorRef:ChangeDetectorRef
    ) {
        /* Get Account Types. */
        this.accountTypes = userAdminService.getAccountTypes();

        /* Get User Types. */
        this.userTypes = userAdminService.getUserTypes();

        /* Subscribe to the admin user list observable. */
        this.userListSubscription = this.userAdminService.getUserListSubject().subscribe((list) => {
            this.usersList = this.convertToArray(list);

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
                "title": "<i class='fa fa-user'></i> Add User",
                "userId": -1,
                "formControl": new FormGroup(
                    {
                        "username": new FormControl(''),
                        "email": new FormControl(''),
                        "accountType": new FormControl([]),
                        "userType": new FormControl([]),
                        "password": new FormControl('')
                    }
                ),
                "active": false
            }
        ];
    }

    ngAfterViewInit():void {
        /* Override the changes. */
        this.changeDetectorRef.detectChanges();

        /* Ask for update from the service above. */
        this.userAdminService.updateState();
    }

    ngOnDestroy ():void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        this.userListSubscription.unsubscribe();
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
    public convertToArray (obj):Array<any> {
        let i = 0, key, newArray = [];
        for (key in obj) {
            newArray.push( obj[key] );
            newArray[ newArray.length - 1 ].index = i++; // used to maintain order.
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
    public handleNewUser (tabid:number):void {
        /* Sort the data structure out. */
        let
        dataToSend = this.tabsControl[tabid].formControl.value;
        dataToSend.userType = dataToSend.userType.length ? dataToSend.userType[0].id : 0;
        dataToSend.accountType = dataToSend.accountType.length ? dataToSend.accountType[0].id : 0;

        /* Let's trigger the creation of the user. */
        this.userAdminService.createNewUser( dataToSend ).then((response) => {
            /* Now we've edited the user, we need to send any changes to the groups. */

            /* TODO - handle success message. */
            console.log('Successfully created user.', response);
        }).catch((error) => {
            /* TODO - handle error message. */
            console.log('Failed to create user.', error);
        });

        /* Clear the form. */
        this.clearNewUser(1, false);

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
     public handleEditUser (tabid:number):void {
         /* Sort the data structure out. */
         let formData = this.tabsControl[tabid].formControl.value;
         let dataToSend = {
            'userId': this.tabsControl[tabid].userId.toString(),
            'email': formData.email,
            'userType': formData.userType.length ? formData.userType[0].id : 0,
            'account': formData.accountType.length ? formData.accountType[0].id : 0,
            'status': 0
         };

         /* Let's send the edit request. */
         this.userAdminService.editUser( dataToSend ).then((response) => {
             /* Now we've edited the user, we need to send any changes to the groups. */

             /* TODO - handle success message. */
             console.log('Successfully edited user.', response);
         }).catch((error) => {
             /* TODO - handle error message. */
             console.log('Failed to edit user.', error);
         });

         /* Return */
         return;
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
     public handleDelete ( deleteUserIndex ):void {
         /* Get the user's data. */
         let dataToSend = {};
         console.log(this.usersList, deleteUserIndex);
         dataToSend['userId'] = this.usersList[deleteUserIndex].userID;

         /* Send the request. */
         /* TODO - Add a better confirm in here. */
         if (confirm("Are you sure you want to delete "+ this.usersList[deleteUserIndex].userName +"?")) {
             this.userAdminService.deleteUser( dataToSend ).then((response) => {
                 /* TODO - handle succes message. */
                 console.log('Deleted user successfully.', response)
             }).catch((error) => {
                 /* TODO - Handle error message. */
                 console.log('Failed to deleted user.', error);
             });
         }

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
     public handleEdit ( editUserIndex ):void {
         /* Check if the tab is already open. */
         let i;
         for ( i = 0; i < this.tabsControl.length; i++ ) {
             if ( this.tabsControl[i].userId === this.usersList[editUserIndex].userID ) {
                 /* Found the index for that tab, lets activate it... */
                 this.setTabActive(i);

                 /* And return. */
                 return;
             }
         }

         /* Push the edit tab into the array. */
         let user = this.usersList[editUserIndex];
         let accountType = this.userAdminService.resolveAccountType( { text: user.accountName } );
         let userType = this.userAdminService.resolveUserType( { id: user.userType } );

         /* And also prefill the form... let's sort some of the data out. */
         this.tabsControl.push({
             "title": "<i class='fa fa-user'></i> "+ this.usersList[ editUserIndex ].userName,
             "userId": user.userID,
             "formControl": new FormGroup(
                 {
                     "username": new FormControl( user.userName ),
                     "email": new FormControl( user.emailAddress ),
                     "accountType": new FormControl( accountType ),
                     "userType": new FormControl( userType )
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

      /**
       * Clear New User
       * --------------
       * Clears the new user form, i.e, sets all inputs to not filled.
       *
       * @param {tabid} number - the tabs to clear (will always be 1).
       *
       * @return {void}
       */
      public clearNewUser (tabid, event):void {
          /* Prevent submit. */
          if ( event ) event.preventDefault();

          /* Let's set all the values in the form controls. */
          this.tabsControl[tabid].formControl = new FormGroup(
              {
                  "username": new FormControl(''),
                  "email": new FormControl(''),
                  "accountType": new FormControl( [] ),
                  "userType": new FormControl( [] ),
                  "password": new FormControl('')
              }
          );

          /* Override the changes. */
          this.changeDetectorRef.detectChanges();

          /* Return. */
          return;
      }

}
