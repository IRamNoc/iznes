/* Core imports. */
import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule, FormGroup, FormControl, NgModel } from '@angular/forms';

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
export class AdminUsersComponent implements AfterViewInit {

    @ViewChild('usersDataGrid') usersDataGrid;

    /* User data. */
    public usersData:any;
    public activeEditUser:any;

    public tabsControl:any;

    /* Account types select. */
    public accountType:string;
    public accountTypes:any;

    /* User types select. */
    public userType:string;
    public userTypes:any;

    public editFormControls:any = {
        "username": new FormControl('')
    };

    /* Constructor. */
    constructor (
        private userAdminService:UserAdminService,
        private changeDetectorRef:ChangeDetectorRef
    ) {
        /* Get Account Types. */
        this.accountTypes = userAdminService.getAccountTypes();

        /* Get User Types. */
        this.userTypes = userAdminService.getUserTypes();

        /* Link the users list to this user's data. */
        this.userAdminService.usersListEvent.subscribe((usersList) => {
            this.usersData = this.convertToArray(usersList);
        });

        /* Default tabs. */
        this.tabsControl = [
            {
                "title": "<i class='fa fa-search'></i> Search",
                "active": true
            },
            {
                "title": "<i class='fa fa-user'></i> Add User",
                "formControl": new FormGroup(
                    {
                        "username": new FormControl(''),
                        "email": new FormControl(''),
                        "accountType": new FormControl(''),
                        "userType": new FormControl(''),
                        "password": new FormControl('')
                    }
                ),
                "active": false
            }
        ]
    }

    ngAfterViewInit() {
        /* Override the changes. */
        this.changeDetectorRef.detectChanges();
    }

    public convertToArray (obj):Array<any> {
        let key, newArray = [];
        for (key in obj) {
            newArray.push( obj[key] );
        }
        return newArray;
    }

    /* Handles a ng2-select selection. */
    public selected(propertyName:string, value:any):void {
        this[propertyName] = value;
    }

    /* Handles a ng2-select deletion. */
    public removed(propertyName:string, value:any):void {
        this[propertyName] = undefined;
    }

    /**
     * Handle New User
     * Handles saving a new user.
     *
     * @param {tabid}
     * @return {void}
     */
    public handleNewUser (tabid:number):void {
        /* Let's trigger the creation of the user. */
        // this.userAdminService.createNewUser(
        //     this.tabsControl[tabid].formControl.value
        // );
        //
        // /* Return. */
        // return;
    }

     /**
      * Handle Edit User
      * Handles saving an edited user.
      *
      * @param {tabid} number - The formcontrol obbject that relates
      * to this edit form tab.
      * @return {void}
      */
     public handleEditUser (tabid:number):void {

         console.log(
             JSON.stringify(
                 this.tabsControl[tabid].formControl.value
             )
         );
     }

     /**
      * Handle Delete
      * Handles the deletion of a user.
      *
      * @param {deleteUserIndex} object - Contains the target user's index.
      *
      * @return {void}
      */
     public handleDelete ( deleteUserIndex ):void {
         /* Check we have the wallet's index... */
         if ( (! deleteUserIndex && deleteUserIndex !== 0) || this.usersData.length === 0 ) {
             return;
         }

         /*
             ...so we do, lets remove it from the data by setting the data to an
             array with everything before and everything after.
         */
         /* TODO update this to dispatch a redux action. */
         console.log(' |--- Requested a delete.');
         console.log(' | index: ', deleteUserIndex);
         console.log(' | data length: ', this.usersData.length );
         console.log(' | all before: ', this.usersData.slice(0, deleteUserIndex) );
         console.log(' | to delete: ', this.usersData[deleteUserIndex] );
         console.log(' | all after: ', this.usersData.slice(deleteUserIndex + 1, this.usersData.length) );
         this.usersData = [
             ...this.usersData.slice(0, deleteUserIndex),
             ...this.usersData.slice(deleteUserIndex + 1, this.usersData.length)
         ];

         /* Return. */
         return;
     }

     /**
      * Handle Edit
      * Handles the editting of a wallet.
      *
      * @param {editWalletIndex} number - The index of a wallet to be editted.
      *
      * @return {void}
      */
     public handleEdit ( editWalletIndex ):void {
         /* Push the edit tab into the array. */
         this.tabsControl.push({
             "title": "<i class='fa fa-user'></i> "+ this.usersData[ editWalletIndex ].userName,
             "formControl": new FormGroup(
                 {
                     "username": new FormControl(''),
                     "email": new FormControl(''),
                     "accountType": new FormControl(''),
                     "userType": new FormControl(''),
                     "password": new FormControl(''),
                 }
             ),
             "active": false // this.editFormControls
         });

         console.log( this.tabsControl[this.tabsControl.length - 1] );

         /* Activate the new tab. */
         this.setTabActive( this.tabsControl.length - 1 );

         /* Return. */
         return;
     }

     /**
      * Clear Form
      * Clears the new group form.
      *
      * @return {void}
      */
      public clearForm ():void {

          /* Return. */
          return;
      }

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

      public setTabActive (index:number = 0) {
          /* Lets loop over all current tabs and switch them to not active. */
          this.tabsControl.map((i) => {
             i.active = false;
          });

          /* Override the changes. */
          this.changeDetectorRef.detectChanges();

          /* Set the list active. */
          this.tabsControl[index].active = true;

          /* Override the changes. */
          this.changeDetectorRef.detectChanges();
      }

}
