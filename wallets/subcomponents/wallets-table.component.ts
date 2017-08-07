/* Core imports. */
import { Component, Input } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

/* Decorator. */
@Component({
    selector: 'setl-admin-wallets-table',
    templateUrl: 'wallets-table.component.html',
    styleUrls: [
        'wallets-table.component.css'
    ]
})

/* Class. */
export class AdminWalletsTableComponent {

    /* Input for the data. */
    @Input()
    public dataArray:any;

    /* Constructor. */
    constructor () {
        /* Stub */
    }

}
