/* Core imports. */
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

/* Users table. */
import { AdminUsersTableComponent } from './subcomponents/users-table.component';

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
export class AdminUsersComponent {

    public usersData:any = [
        {
            'username': 'Daniel',
            'email': 'dan.sarracayo@setl.io',
            'account': 'Something...',
            'enabled': true
        },
        {
            'username': 'Ollie',
            'email': 'ollie.kett@setl.io',
            'account': 'Something else...',
            'enabled': false
        },
        {
            'username': 'Like',
            'email': 'luke.bowen@setl.io',
            'account': 'Something else 5...',
            'enabled': true
        },
        {
            'username': 'Ming',
            'email': 'ming.boss.man@setl.io',
            'account': 'Something else 2...',
            'enabled': true
        }
    ];

    /* Account types select. */
    public accountType:string;
    public accountTypes:any;

    /* User types select. */
    public userType:string;
    public userTypes:any;

    /* Constructor. */
    constructor (private userAdminService:UserAdminService) {
        /* Get Account Types. */
        this.accountTypes = userAdminService.getAccountTypes();

        /* Get User Types. */
        this.userTypes = userAdminService.getUserTypes();
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
     * Handle Save
     * Handles saving a user.
     *
     * @param {event}
     * @return {void}
     */
     public handleSave ( event ):void {

         /* Return. */
         return;
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
         this.usersData = [
             ...this.usersData.slice(0, deleteUserIndex - 1),
             ...this.usersData.slice(deleteUserIndex, this.usersData.length)
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

}
