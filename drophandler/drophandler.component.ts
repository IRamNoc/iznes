/* Core imports. */
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ElementRef,
    Renderer,
    ChangeDetectorRef
} from '@angular/core';

import {FormControl} from '@angular/forms';

/* Decorator. */
@Component({
    selector: 'drop-handler',
    templateUrl: 'drophandler.component.html',
    styleUrls: ['drophandler.component.css']
})

/* Class. */
export class DropHandler {
    /* Events */
    @Output() onDropFiles:EventEmitter<{}> = new EventEmitter();

    /* Allow multiple. */
    @Input() multiple:boolean = false;

    /* Form control. */
    @Input() formControl:FormControl;

    /* Inputs and forms. */
    @ViewChild('fileInput') public fileInput:ElementRef;
    @ViewChild('dropFileForm') public formElem:ElementRef;

    public isHovering:boolean = false;
    public uploadedFiles:any;
    public encodedFiles:any = [];
    public proccessInterval:any;
    public uploadPrompt:string;
    public numberFilesText:string;
    public AfterViewInit:string;

    private removingFile = false;

    /* Constructor */
    public constructor (
        private renderer:Renderer,
        private changeDetectorRef:ChangeDetectorRef
    ) {
        /* Stub */
    }

    /* On View Init. */
    public ngAfterViewInit ():void {
        /* Fix the text on the ui. */
        this.uploadPrompt = this.multiple ? "Drag and Drop files here, or Click to Upload" : "Drag and Drop a file here, or Click to Upload";
        this.changeDetectorRef.detectChanges();

        /* Also fix the files text. */
        this.updateFilesText();
    }

    /**
     * Input handlers
     * --------------
     */

    /**
     * Handle Drop
     * -----------
     * Handles a drop event on the dropzone.
     *
     * @param  {event} object - The drop event, contains all information.
     * @return {boolean}
     */
    public handleDrop (event):boolean {
        /* Check if files were dropped... */
        if ( event.dataTransfer && event.dataTransfer.files ) {
            /* Set the uploaded files. */
            this.uploadedFiles = event.dataTransfer.files;

            /* Detect change. */
            this.changeDetectorRef.detectChanges();
        }

        /* Stop bubbling. */
        event.preventDefault();

        /* Return false. */
        return false;
    }

    /**
     * Handle Click
     * ------------
     * Handles click events on the dropzone.
     *
     * @param  {event} object - Contains information about the click.
     * @return {boolean}
     */
    public handleClick(event):boolean {
        /* Prevent default. */
        event.preventDefault();

        /* Cancel if we're just removing a file. */
        if ( this.removingFile ) return;

        /* Handle click event of native file input. */
        let clickevent = new MouseEvent('click', {bubbles: true});
        this.renderer.invokeElementMethod(
            this.fileInput.nativeElement, 'dispatchEvent', [clickevent]
        );

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();

        /* Return false. */
        return false;
    }

    /**
     * Handle File Change
     * ------------------
     * Handles the changing of files, i.e the processing and building of the file array.
     *
     * @param {event} object - the change event on the file input.
     * @return {boolean}
     */
    public handleFileChange (event):boolean {
        /* Check. */
        if ( event.target && event.target.files ) {
            /* Proccess images. */
            this.base64Files(event.target.files, (processedFiles) => {
                /* Set the new files. */
                this.encodedFiles = processedFiles;

                /* Emit the files. */
                this.emitFilesEvent();

                /* Update text */
                this.updateFilesText();
            });
        }

        /* Return. */
        return false;
    }

    /**
     * Action handlers
     * --------------
     */

    /**
     * Stop Propigation
     * ----------------
     * Basically stops bubbling on the dom.
     *
     * @param  {event} object - object of event.
     * @return {boolean}
     */
    public stopPropigation(event):boolean {
        /* Stop bubbling. */
        event.preventDefault();

        /* Return. */
        return false;
    }

    /**
     * On Drag Enter
     * -------------
     * Handles a user dragging files over the drop zone.
     *
     * @param {event} object - An object of the event.
     */
    public onDragEnter (event):void {
        /* Change the hovering state. */
        this.isHovering = true;

        /* Update the prompt text. */
        this.uploadPrompt = "Drop your files to add them!";
    }

    /**
     * On Drag Enter
     * -------------
     * Handles a user dragging files over the drop zone but reverse.
     *
     * @param {event} object - An object of the event.
     */
    public onDragLeave (event):void {
        /* Change the hovering state. */
        this.isHovering = false;

        /* Update the prompt text. */
        this.uploadPrompt = "Drag and Drop a file here, or Click to Upload";
    }

    /**
     * Clear Files
     * -----------
     * Clears a file from the file drop list.
     *
     * @param {index} number - The index of the file in the array to be removed.
     */
    public clearFiles(index):void {
        /* If we're not mutliple, then just reset the form. */
        if ( ! this.multiple ) {
            this.formElem.nativeElement.reset();
        }

        /* Set removing file flag. */
        this.removingFile = true;

        /* Slice the files. */
        this.encodedFiles = [
            ...this.encodedFiles.slice(0, index),
            ...this.encodedFiles.slice(index + 1, this.encodedFiles.length)
        ];

        /* Update the UI. */
        this.updateFilesText();

        /* Set removing file flag. */
        this.removingFile = false;

        /* Emit the files. */
        this.emitFilesEvent();

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Base 64 Files
     * -------------
     * Takes in normal a normal files array and base64's them.
     *
     * @param  {files} array - an array of raw files.
     * @param  {callback} Function - a callback function, passed the encoded files array.
     * @return {void}
     */
    public base64Files (files, callback):void {
        /* Variables. */
        let
        i,
        file:File,
        myReader:FileReader,
        grandTotal:number = 0;

        /* Return if no files. */
        if ( ! files.length ) return;

        /* If mutliple, only do the first. */
        if ( ! this.multiple ) {
            files = [files[0]];
        }

        /* Reset encoded files. */
        this.encodedFiles = [];

        /* Loop over files. */
        for ( i = 0; i < files.length; i++ ) {
            /* Set a pointer. */
            file = files[i];

            /* Check for file. */
            if ( ! file ) {
                continue;
            }

            /* Add to the grand total, used to check later. */
            grandTotal++;

            /* Instatiate a new reader. */
            myReader = new FileReader();

            /* Set on load handler and bind this. */
            myReader.onload = this.handleFileConverted.bind(this);

            /* Proccess the file. */
            myReader.readAsBinaryString(file);
        }

        /* Now wait for all files to be done. */
        this.proccessInterval = setInterval(() => {
            /* Check if the files have been processed. */
            if ( grandTotal === this.encodedFiles.length ) {
                /* If they're all done, clear this interval. */
                clearInterval(this.proccessInterval);

                /* Let's loop over the files.... */
                for ( i = 0; i < files.length; i++ ) {
                    /* ...continue if no file... */
                    if ( ! file ) {
                        continue;
                    }

                    /* ...if we have a file, add the meta data back... */
                    this.encodedFiles[i].name = files[i].name;
                    this.encodedFiles[i].lastModified = files[i].lastModified;
                }

                /* Call the callback, when done. */
                callback( this.encodedFiles );
            }
        }, 250); // 250 to save the lag spike during upload.
    }

    /**
     * Emit Files Event
     * ----------------
     * Triggers an emmission of the encoded files array.
     *
     * @return {void}
     */
    private emitFilesEvent () {
        /* Emit the event up a level. */
        this.onDropFiles.emit({
            'files': this.encodedFiles
        });

        /* Also patch the from control value. */
        this.formControl.patchValue( this.encodedFiles );
    }

    /**
     * Handle File Converted
     * ---------------------
     * A handler for the fileReader used to encode the files.
     *
     * @param  {readerEvt} object - the reader event object.
     * @return {void}
     */
    private handleFileConverted (readerEvt):void {
        /* Encode the raw data in base64. */
        var base64data = btoa(readerEvt.target.result);

        /* Push the file object into the encodedFiles array. */
        this.encodedFiles.push({'data': base64data});
    }

    /**
     * Update Files Text
     * -----------------
     * Basically updates the text that tells the user how many files they've uploaded.
     *
     * @return {void}
     */
    private updateFilesText ():void {
        /* Update. */
        this.numberFilesText = ((!this.encodedFiles || this.encodedFiles.length === 0) ? "No" : this.encodedFiles.length) + " "+ (this.multiple && this.encodedFiles.length > 1 ? "files" : "file") +" selected.";

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();
    }

}
