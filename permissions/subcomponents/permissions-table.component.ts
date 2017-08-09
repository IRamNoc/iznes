/* Core imports. */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

/* Decorator. */
@Component({
    selector: 'setl-admin-permissions-table',
    templateUrl: 'permissions-table.component.html',
    styleUrls: [
        'permissions-table.component.css'
    ]
})

/* Class. */
export class AdminPermissionsTableComponent {

    /* Input for the data. */
    @Input()
    public dataArray:any;

    @Output()
    public deleteEvent:EventEmitter<number> = new EventEmitter();

    @Output()
    public editEvent:EventEmitter<number> = new EventEmitter();

    /* Constructor. */
    constructor () {
        /* Stub */
    }

    public deleteEventHandler (event):void {
        /* Emit */
        console.log("emitting delete event: ", event + 1);
        this.deleteEvent.emit(event + 1);
    }

    public editEventHandler (event):void {
        /* Emit */
        console.log("emitting edit event: ", event + 1);
        this.editEvent.emit(event + 1);
    }

}
