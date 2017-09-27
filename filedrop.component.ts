/* Core imports. */
import { Component, Input, Output, EventEmitter } from '@angular/core';

/* Form Group. */
import { FormControl } from '@angular/forms';

/* DropHandler Component */
import { DropHandler } from './drophandler/drophandler.component';

@Component({
    selector: 'setl-file-drop',
    templateUrl: 'filedrop.component.html',
    styleUrls: ['filedrop.component.css']
})

export class FileDropComponent {
    /* OnDrop event - emit every file that's dropped or removed. */
    @Output() onDrop:EventEmitter<{}> = new EventEmitter();

    /* Form control, if not passed in, we'll make a headless one. */
    @Input() formControl:FormControl = new FormControl([]);

    /* Multiple allows more than one file to be added. */
    @Input() multiple:boolean = false;

    /* Constructor */
    public constructor () {
        /* Stub */
    }

    /**
     * Handle Drop Files
     * -----------------
     * Handles the emittion of the file data.
     *
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    public handleDropFiles (event) {
        this.onDrop.emit(event);
    }
}
