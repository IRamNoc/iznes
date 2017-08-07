/* Core imports. */
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';


/* Users table. */
import { AdminWalletsTableComponent } from './subcomponents/wallets-table.component';

/* Decorator. */
@Component({
    selector: 'setl-admin-wallets',
    templateUrl: 'wallets.component.html',
    styleUrls: [ 'wallets.component.css' ]
})

/* Class. */
export class AdminWalletsComponent {

    /* Properties. */
    public walletsData:any = [];

    /* Constructor. */
    constructor () {
        /* Stub */
    }

}
