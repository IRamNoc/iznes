/* Core imports. */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/* Form Group. */
import { FormControl } from '@angular/forms';

/* DropHandler Component */
import { DropHandler, FilePermission } from './drophandler/drophandler.component';
import { FileDropItem } from './FileDrop';

@Component({
    selector: 'setl-file-drop',
    templateUrl: 'filedrop.component.html',
    styleUrls: ['filedrop.component.css']
})

export class FileDropComponent implements OnInit {
    /* OnDrop event - emit every file that's dropped or removed. */
    @Output() onDrop:EventEmitter<{}> = new EventEmitter();

    /* Form control, if not passed in, we'll make a headless one. */
    @Input() formControl:FormControl = new FormControl([]);

    /* Multiple allows more than one file to be added. */
    @Input() multiple:boolean = false;

    /* Used to display inline version. */
    @Input() inline:boolean = false;

    @Input() preset:FileDropItem = null;

    @Input() filePermission: FilePermission = FilePermission.Private;

    /* Constructor */
    public constructor () {
        /* Stub */
    }

    ngOnInit() { }

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
