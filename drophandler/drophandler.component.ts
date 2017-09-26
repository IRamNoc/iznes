/* Core imports. */
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ElementRef,
    Renderer
} from '@angular/core';

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

    /* Inputs and forms. */
    @ViewChild('fileInput') public fileInput:ElementRef;
    @ViewChild('dropFileForm') public formElem:ElementRef;

    public isHovering:boolean = false;
    public uploadedFiles:any;
    public encodedFiles:any = [];
    public proccessInterval:any;
    public uploadPrompt:string = "Drag and Drop a file here, or Click to Upload";
    public numberFilesText:string = "No files selected.";
    public AfterViewInit:string;

    /* Constructor */
    public constructor (
        private renderer:Renderer
    ) {
        /* Stub */
    }

    /* On View Init. */
    public ngAfterViewInit ():void {
        this.numberFilesText = ((!this.encodedFiles || this.encodedFiles.length === 0) ? "No" : this.encodedFiles.length) + " files selected.";
    }

    /* Handles a new file being added or removed. */
    public handleFileChange (event):void {
        /* Check. */
        if ( event.target && event.target.files ) {
            let thisClass = this;
            /* Proccess images. */
            this.base64Files(event.target.files, function (files) {
                /* Emit the event up a level. */
                thisClass.onDropFiles.emit({
                    'files': files
                });

                thisClass.encodedFiles = files;

                /* Update text. */
                console.log( "Added a file.", thisClass.uploadedFiles );
                thisClass.numberFilesText = ((!thisClass.encodedFiles || thisClass.encodedFiles.length === 0) ? "No" : thisClass.encodedFiles.length) + " files selected.";
            });

        }
    }

    public handleDrop (event):boolean {
        /* Check if files were dropped and add them to the input. */
        if ( event.dataTransfer && event.dataTransfer.files ) {
            this.uploadedFiles = event.dataTransfer.files;
        }

        /* Stop bubbling. */
        event.preventDefault();
        return false;
    }

    public handleClick(event):boolean {
        /* Prevent default */
        event.preventDefault();

        /* Handle click event of native file input. */
        let clickevent = new MouseEvent('click', {bubbles: true});
        this.renderer.invokeElementMethod(
            this.fileInput.nativeElement, 'dispatchEvent', [clickevent]
        );
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
        let thisClass = this;
        this.proccessInterval = setInterval(function(){
            if ( grandTotal === thisClass.encodedFiles.length ) {
                clearInterval(thisClass.proccessInterval);

                for ( i = 0; i < files.length; i++ ) {
                    if ( ! file ) {
                        continue;
                    }
                    thisClass.encodedFiles[i].name = files[i].name;
                    thisClass.encodedFiles[i].lastModified = files[i].lastModified;
                }
                callback( thisClass.encodedFiles );
            }
        }, 10);
    }

    public handleFileConverted (readerEvt):any {
        /* Get the raw data. */
        var binaryString = readerEvt.target.result;

        /* Set the encodedImage. */
        this.encodedFiles.push({'data': btoa(binaryString)});
    }

    public clearFiles():void {
        this.formElem.nativeElement.reset();
        this.uploadedFiles = {};
    }
}
