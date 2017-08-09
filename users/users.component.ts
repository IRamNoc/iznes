/* Core imports. */
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

/* Users table. */
import { AdminUsersTableComponent } from './subcomponents/users-table.component';

/* Decorator. */
@Component({
    selector: 'setl-admin-users',
    templateUrl: 'users.component.html',
    styleUrls: [ 'users.component.css' ]
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

    /* Constructor. */
    constructor () {
        /* Stub */
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
