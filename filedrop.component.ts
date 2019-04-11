/* Core imports. */
import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';

/* Form Group. */
import { FormControl } from '@angular/forms';

/* DropHandler Component */
import { FileDropItem, FileDropEvent, FilePermission, ImageConstraint, AllowFileType } from './FileDrop';
import { DropHandler } from './drophandler/drophandler.component';

@Component({
    selector: 'setl-file-drop',
    templateUrl: 'filedrop.component.html',
    styleUrls: ['filedrop.component.css'],
})

export class FileDropComponent implements OnInit {
    /* OnDrop event - emit every file that's dropped or removed. */
    @Output() onDrop:EventEmitter<FileDropEvent> = new EventEmitter();

    /* Form control, if not passed in, we'll make a headless one. */
    @Input() formControl:FormControl = new FormControl([]);

    /* Multiple allows more than one file to be added. */
    @Input() multiple:boolean = false;

    /* Used to display inline version. */
    @Input() inline:boolean = false;

    @Input() preset:FileDropItem = null;

    @Input() filePermission: FilePermission = FilePermission.Private;

    @Input()
    public set disabled(v: boolean) {
        console.warn('[core-filedrop] Input "disabled" has will be deprecated. Due to Angular warning. Please use "isDisabled" instead.');
        this.disabledFlag = v;
    }

    @ViewChild('dropHandler') dropHandlerRef: DropHandler;

    public get disabled(): boolean {
        return this.disabledFlag;
    }

    @Input()
    set isDisabled(v: boolean) {
        this.disabledFlag = v;
    }

    // whether to show file's preview
    @Input() usePreview: boolean = false;

    // image constraint
    @Input() imageConstraint: ImageConstraint;

    // allow file types
    @Input() allowFileTypes: AllowFileType[];

    private disabledFlag = false;

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
