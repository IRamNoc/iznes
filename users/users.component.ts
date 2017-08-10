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

    public userData:any = [
        {
            'username': 'Daniel',
            'email': 'dan.sarracayo@setl.io',
            'account': 'Something...',
            'enabled': 'true'
        },
        {
            'username': 'Ollie',
            'email': 'ollie.kett@setl.io',
            'account': 'Something else...',
            'enabled': 'false'
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
      * Deletes a user.
      *
      * @param {index}
      * @return {void}
      */
     public handleDelete (index):void {

         /* Return. */
         return;
     }

     /**
      * Handle Edit
      * Edits a user.
      *
      * @param {index}
      * @return {void}
      */
     public handleEdit (index):void {

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
