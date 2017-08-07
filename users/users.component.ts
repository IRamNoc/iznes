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

}
