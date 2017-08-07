/* Core imports. */
import { Component, Input } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

/* Decorator. */
@Component({
    selector: 'setl-admin-users-table',
    templateUrl: 'users-table.component.html',
    styleUrls: [
        'users-table.component.css'
    ]
})

/* Class. */
export class AdminUsersTableComponent {

    /* Input for the data. */
    @Input()
    public dataArray:any;

    /* Constructor. */
    constructor () {
        /* Stub */
    }

}
