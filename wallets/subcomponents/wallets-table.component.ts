/* Core imports. */
import { Component, Input, Output, EventEmitter } from '@angular/core';
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

    @Output()
    public deleteEvent:EventEmitter<{}> = new EventEmitter();

    @Output()
    public editEvent:EventEmitter<{}> = new EventEmitter();

    /* Constructor. */
    constructor () {
        /* Stub */
    }

    public deleteEventHandler (event):void {
        /* Emit */
        this.deleteEvent.emit(event);
    }

    public editEventHandler (event):void {
        /* Emit */
        this.editEvent.emit(event);
    }

}
