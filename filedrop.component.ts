/* Core imports. */
import { Component, Input, Output, EventEmitter } from '@angular/core';

/* DropHandler Component */
import { DropHandler } from './drophandler/drophandler.component';

@Component({
    selector: 'setl-file-drop',
    templateUrl: 'filedrop.component.html',
    styleUrls: ['filedrop.component.css']
})

export class DropFile {
    /* OnDrop event - emit every file that's dropped or removed. */
    @Output() onDrop:EventEmitter<{}> = new EventEmitter();

    /* Multiple allows more than one file to be added. */
    @Input() multiple:boolean = true;

    @Input() catergory:string = "";

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
