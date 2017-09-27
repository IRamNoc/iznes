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

    /* Handles a new file being added or removed. */
    public handleFileChange (event):void {
        /* Check. */
        if ( event.target && event.target.files ) {
            /* Proccess images. */
            this.base64Files(event.target.files, (files) => {
                /* Set the new files. */
                this.encodedFiles = files;

                /* Emit the files. */
                this.emitFilesEvent();

                /* Update text */
                this.updateFilesText();
            });
        }
    }

    public updateFilesText () {
        /* Update. */
        this.numberFilesText = ((!this.encodedFiles || this.encodedFiles.length === 0) ? "No" : this.encodedFiles.length) + " "+ (this.multiple && this.encodedFiles.length > 1 ? "files" : "file") +" selected.";

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();
    }

    private emitFilesEvent () {
        /* Emit the event up a level. */
        this.onDropFiles.emit({
            'files': this.encodedFiles
        });

        /* Also patch the from control value. */
        this.formControl.patchValue( this.encodedFiles );
    }

    public handleDrop (event):boolean {
        /* Check if files were dropped and add them to the input. */
        if ( event.dataTransfer && event.dataTransfer.files ) {
            this.uploadedFiles = event.dataTransfer.files;
            this.changeDetectorRef.detectChanges();
        }

        /* Stop bubbling. */
        event.preventDefault();
        return false;
    }

    public handleClick(event):boolean {
        /* Prevent default */
        event.preventDefault();

        if ( this.removingFile ) return;

        /* Handle click event of native file input. */
        let clickevent = new MouseEvent('click', {bubbles: true});
        this.renderer.invokeElementMethod(
            this.fileInput.nativeElement, 'dispatchEvent', [clickevent]
        );

        this.changeDetectorRef.detectChanges();

        return false;
    }

    public stopPropigation(event):boolean {
        /* Stop bubbling. */
        event.preventDefault();
        return false;
    }

    public onDragEnter (event):void {
        this.isHovering = true;
        this.uploadPrompt = "Drop your files to add them!";
    }

    public onDragLeave (event):void {
        this.isHovering = false;
        this.uploadPrompt = "Drag and Drop a file here, or Click to Upload";
    }

    public base64Files (files, callback):any {
        /* Set up File reader. */
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
            file = files[i];

            /* Check for file. */
            if ( ! file ) {
                continue;
            }
            grandTotal++;

            myReader = new FileReader()

            /* Set on load handler. */
            myReader.onload = this.handleFileConverted.bind(this);

            /* Proccess the file. */
            myReader.readAsBinaryString(file);
        }

        /* Wait for all files to be done. */
        this.proccessInterval = setInterval(() => {
            if ( grandTotal === this.encodedFiles.length ) {
                clearInterval(this.proccessInterval);

                for ( i = 0; i < files.length; i++ ) {
                    if ( ! file ) {
                        continue;
                    }
                    this.encodedFiles[i].name = files[i].name;
                    this.encodedFiles[i].lastModified = files[i].lastModified;
                }
                callback( this.encodedFiles );
            }
        }, 10);
    }

    public handleFileConverted (readerEvt):any {
        /* Get the raw data. */
        var binaryString = readerEvt.target.result;

        /* Set the encodedImage. */
        this.encodedFiles.push({'data': btoa(binaryString)});
    }

    public clearFiles(index):void {
        /* If we're not mutliple, then reset the form. */
        if ( ! this.multiple ) {
            this.formElem.nativeElement.reset();
        }

        this.removingFile = true;

        /* Slice the files. */
        this.encodedFiles = [
            ...this.encodedFiles.slice(0, index),
            ...this.encodedFiles.slice(index + 1, this.encodedFiles.length)
        ];

        /* Update the UI. */
        this.updateFilesText();

        this.removingFile = false;

        /* Emit the files. */
        this.emitFilesEvent();

        this.changeDetectorRef.detectChanges();
    }
}
