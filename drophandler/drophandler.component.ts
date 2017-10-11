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
import {AlertsService, AlertType} from '@setl/jaspero-ng2-alerts';

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

    /* Public variables. */
    public isHovering:boolean = false;
    public encodedFiles:any = [];
    public numberFilesText:any;
    public uploadPrompt:any;

    /* Private variables. */
    private uploadedFiles:any = [];
    private silentEncodedFiles:any = [];
    private proccessInterval:any;
    private removingFile:boolean = false;
    private maxFileSize:number = 10485760; // 10 MB

    /* Constructor */
    public constructor (
        public renderer:Renderer,
        public changeDetectorRef:ChangeDetectorRef,
        public alertsService: AlertsService
    ) {
        /* Stub */
    }

    /* On View Init. */
    public ngAfterViewInit ():void {
        /* Fix the text on the ui. */
        if (this.multiple) {
            this.uploadPrompt = 'Drag and Drop files here, or Click to Upload';
        } else {
            this.uploadPrompt = 'Drag and Drop a file here, or Click to Upload';
        }
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
            let invalidFileNames = [];
            let validFiles = [];
            _.each(event.dataTransfer.files, (function (file) {
                if (!this.isValidFileSize(file)) {
                    invalidFileNames.push(file.name);
                } else {
                    validFiles.push(file);
                }
            }).bind(this));

            if (invalidFileNames.length > 0) {
                let message = 'File';
                if (invalidFileNames.length > 1) {
                    message += 's';
                }
                message += ' \'' + invalidFileNames.join('\', \'') + '\' exceed';
                if (invalidFileNames.length === 1) {
                    message += 's';
                }
                message += ' maximum file size for upload.';
                this.showAlert(
                    message,
                    'error'
                );
            }

            if (validFiles.length < 1) {
                return;
            }

            /* Set the uploaded files. */
            this.addFiles(validFiles);

            /* Process the files. */
            this.handleConversion();
        }

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();

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
        /* Cancel if we're just removing a file. */
        if ( this.removingFile ) return;

        /* Handle click event of native file input. */
        let clickevent = new MouseEvent('click', {bubbles: true});
        this.renderer.invokeElementMethod(
            this.fileInput.nativeElement, 'dispatchEvent', [clickevent]
        );

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();

        /* Prevent default. */
        event.preventDefault();

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
            let invalidFileNames = [];
            let validFiles = [];
            _.each(event.target.files, (function (file, fileIndex) {
                if (!this.isValidFileSize(file)) {
                    invalidFileNames.push(file.name);
                } else {
                    validFiles.push(file);
                }
            }).bind(this));

            if (invalidFileNames.length > 0) {
                let message = 'File';
                if (invalidFileNames.length > 1) {
                    message += 's';
                }
                message += ' \'' + invalidFileNames.join('\', \'') + '\' exceed';
                if (invalidFileNames.length === 1) {
                    message += 's';
                }
                message += ' maximum file size for upload.';
                this.showAlert(
                    message,
                    'error'
                );
            }

            if (validFiles.length < 1) {
                return;
            }

            /* Set the uploaded files. */
            this.addFiles(validFiles);

            /* Proccess the files. */
            this.handleConversion()
        }

        /* Return. */
        return false;
    }

    /**
     * Add Files
     * ---------
     * Adds files to the uploadedFiles.
     *
     * @param  {array} files - an array of the files.
     * @return {void}
     */
    private addFiles (files):void {
        /* Loop over each... */
        for (let file of files) {
            /* ...and push. */
            this.uploadedFiles.push(file);
        }
    }

    /**
     * Handle Conversion
     * -----------------
     * Pulls in the uploaded files and converts them into the encoded files.
     *
     * @return {void}
     */
    private handleConversion ():void {
        /* Proccess files. */
        this.base64Files(this.uploadedFiles, (processedFiles) => {
            /* Set the new files. */
            this.encodedFiles = processedFiles;

            /* Emit the files. */
            this.emitFilesEvent();

            /* Update text */
            this.updateFilesText();
        });
    }

    /**
     * Action handlers
     * --------------
     */

    /**
     * Stop Propagation
     * ----------------
     * Basically stops bubbling on the dom.
     *
     * @param  {event} object - object of event.
     * @return {boolean}
     */
    public stopPropagation(event):boolean {
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
        this.uploadPrompt = 'Drop your files to add them!';
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
        this.uploadPrompt = 'Drag and Drop a file here, or Click to Upload';
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

        /* Slice the encoded files. */
        this.encodedFiles = [
            ...this.encodedFiles.slice(0, index),
            ...this.encodedFiles.slice(index + 1, this.encodedFiles.length)
        ];

        /* Slice the uploaded files. */
        this.uploadedFiles = [
            ...this.uploadedFiles.slice(0, index),
            ...this.uploadedFiles.slice(index + 1, this.uploadedFiles.length)
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
    private base64Files (files, callback):void {
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

        /* Reset silent encoded files. */
        this.silentEncodedFiles = [];

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
            if ( grandTotal === this.silentEncodedFiles.length ) {
                /* If they're all done, clear this interval. */
                clearInterval(this.proccessInterval);

                /* Let's loop over the files.... */
                for ( i = 0; i < files.length; i++ ) {
                    /* ...continue if no file... */
                    if ( ! file ) {
                        continue;
                    }

                    /* ...if we have a file, add the meta data back... */
                    this.silentEncodedFiles[i].name = files[i].name;
                    this.silentEncodedFiles[i].lastModified = files[i].lastModified;
                }

                /* Call the callback, when done. */
                callback( this.silentEncodedFiles );
            }
        }, 250); // 250 to save the lag spike during upload.
    }

    /**
     * Emit Files Event
     * ----------------
     * Triggers an emission of the encoded files array.
     *
     * @return {void}
     */
    private emitFilesEvent () {
        /* Emit the event up a level. */
        this.onDropFiles.emit({
            'target': this,
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
        const base64data = btoa(readerEvt.target.result);

        /* Push the file object into the encodedFiles array. */
        this.silentEncodedFiles.push({'data': base64data});
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
        this.numberFilesText = (
            (!this.encodedFiles || this.encodedFiles.length === 0) ? 'No' : this.encodedFiles.length) + ' ' +
            (this.multiple && this.encodedFiles.length > 1 ? 'files' : 'file') + ' selected.';

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Update File Status
     *
     * @param fileIndex
     * @param status
     *
     * @return {void}
     */
    public updateFileStatus(fileIndex, status) {
        if (fileIndex > this.encodedFiles.length - 1) {
            return;
        }
        this.encodedFiles[fileIndex].status = status;
    }

    /**
     * Is Valid File Size
     *
     * @param file
     *
     * @returns {boolean}
     */
    public isValidFileSize(file) {
        if (file.size > this.maxFileSize) {
            return false;
        }
        return true;
    }

    /**
     * Show Alert
     *
     * @param {string} message
     * @param {string} level
     *
     * @return {void}
     */
    public showAlert(message, level = 'error') {
        this.alertsService.create(level as AlertType, `
              <table class="table grid">
                  <tbody>
                      <tr>
                          <td class="text-center text-${level}">${message}</td>
                      </tr>
                  </tbody>
              </table>
          `);
    }

}
