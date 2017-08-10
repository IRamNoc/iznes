/* Core imports. */
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';

/* Users table. */
import { AdminPermissionsTableComponent } from './subcomponents/permissions-table.component';

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
export class AdminPermissionsComponent {

    public permissionsData:any = [];

    /* Form variables. */
    private formGroupName:string = "";
    private formGroupDesc:string = "";
    private formGroupType:string = "";

    /* Account types select. */
    public groupType:string;
    public groupTypes:any;

    /* Constructor. */
    constructor (
        private userAdminService:UserAdminService,
        private toasterService:ToasterService
    ) {
        /* Get User Types. */
        this.groupTypes = userAdminService.getGroupTypes();
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
     * Handles the user saving a group.
     *
     * @param {event}
     * @return {void}
     */
     public handleSave ( event ):void {
         /* Validate the group information. */
         if ( ! this.formGroupName ) {
             this.toasterService.pop('warning', 'Invalid Name', 'The group name you entered was invalid.');
             return;
         }
         if ( ! this.formGroupDesc ) {
             this.toasterService.pop('warning', 'Invalid Description', 'The group description you entered was invalid.');
             return;
         }
         if ( ! this.formGroupType ) {
             this.toasterService.pop('warning', 'Invalid Type', 'The group type you entered was invalid.');
             return;
         }

         /* All is good, so lets push it and tell the user. */
        //  this.toasterService.pop('success', 'Permissions Group', 'Added group successfully!');
         this.permissionsData.push({
            'name': this.formGroupName,
            'type': this.formGroupType,
            'desc': this.formGroupDesc,
         });

         /* Tidy the form up. */
         this.clearForm();

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
         console.log('before: ', this.permissionsData);
         this.permissionsData = [ ...this.permissionsData.slice(0, index - 1), ...this.permissionsData.slice(index, this.permissionsData.length) ];
         console.log('after: ', this.permissionsData);

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
      * Clear Form
      * Clears the new group form.
      *
      * @return {void}
      */
      public clearForm ():void {
          /* Set all properties to a string. */
          this.formGroupName = "";
          this.formGroupDesc = "";
          this.formGroupType = "";

          /* Return. */
          return;
      }

}
