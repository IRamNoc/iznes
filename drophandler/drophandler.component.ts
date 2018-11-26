/* Core imports. */
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ElementRef,
    Renderer,
    ChangeDetectorRef,
    AfterViewInit,
} from '@angular/core';
import * as _ from 'lodash';
import { AlertsService, AlertType } from '@setl/jaspero-ng2-alerts';
import { MultilingualService } from '@setl/multilingual';
import { FormControl } from '@angular/forms';
import { FileDropItem, FilePermission, FileDropEvent, ImageConstraint, AllowFileType, File } from '../FileDrop';

/* Decorator. */
@Component({
    selector: 'drop-handler',
    templateUrl: 'drophandler.component.html',
    styleUrls: ['drophandler.component.css'],
})

/* Class. */
export class DropHandler implements AfterViewInit {
    /* Events */
    @Output() onDropFiles: EventEmitter<FileDropEvent> = new EventEmitter();

    /* Allow multiple. */
    @Input() multiple = false;

    /* Used to display inline version. */
    @Input() inline: boolean = false;

    /* Form control. */
    @Input() formControl: FormControl;

    @Input() preset: FileDropItem = null;

    @Input() filePermission: FilePermission = FilePermission.Private;

    @Input() disabled: boolean = false;

    // whether to show file's preview
    @Input() usePreview: boolean = false;

    // image constraint
    @Input() imageConstraint: ImageConstraint;

    // allow file types
    @Input() allowFileTypes: AllowFileType[];

    /* Inputs and forms. */
    @ViewChild('fileInput') public fileInput: ElementRef;
    @ViewChild('dropFileForm') public formElem: ElementRef;

    /* Public variables. */
    public isHovering = false;
    public encodedFiles: any = [];
    public numberFilesText: any;
    public uploadPrompt: any;
    public uploadedFiles: any = [];

    /* Private variables. */
    private silentEncodedFiles: any = [];
    private processInterval: any;
    private removingFile = false;
    private maxFileSize = 2048576; // 10 MB

    /* Constructor */
    public constructor(
        public renderer: Renderer,
        public changeDetectorRef: ChangeDetectorRef,
        public alertsService: AlertsService,
        public translate: MultilingualService,
    ) {
        /* Stub */
    }

    /* On View Init. */
    public ngAfterViewInit(): void {
        /* Fix the text on the ui. */
        if (this.multiple) {
            this.uploadPrompt = this.translate.translate('Drag and Drop files here, or Click to Upload');
        } else {
            this.uploadPrompt = this.translate.translate('Drag and Drop a file here, or Click to Upload');
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
     * @return {Promise<boolean>}
     */
    public async handleDrop(event): Promise<boolean> {
        if (this.disabled) {
            return;
        }
        /* Check if files were dropped... */
        if (event.dataTransfer && event.dataTransfer.files) {
            const invalidFileSizeNames = [];
            let validFiles = [];
            _.each(event.dataTransfer.files, ((file) => {
                if (!this.isValidFileSize(file)) {
                    invalidFileSizeNames.push(file.name);
                } else {
                    validFiles.push(file);
                }
            }).bind(this));

            if (invalidFileSizeNames.length > 0) {
                let message = '';

                if (invalidFileSizeNames.length > 1) {
                    message += this.translate.translate(
                        'Files \'@invalidFileSizeNames@\' exceed maximum size of upload',
                        { invalidFileSizeNames: invalidFileSizeNames.join('\', \'') });
                }

                if (invalidFileSizeNames.length === 1) {
                    message += this.translate.translate(
                        'File \'@invalidFileSizeNames@\' exceeds maximum size of upload',
                        { invalidFileSizeNames: invalidFileSizeNames.join('\', \'') });
                }

                this.showAlert(
                    message,
                    'error',
                );
            }

            // check image constraint
            validFiles = await this.checkImageConstraint(validFiles);

            // check image constraint
            validFiles = this.checkFileType(validFiles);

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
    public handleClick(event): boolean {
        /* Cancel if we're just removing a file. */
        if (this.removingFile || this.disabled) {
            return;
        }

        /* Handle click event of native file input. */
        const clickevent = new MouseEvent('click', { bubbles: true });
        this.renderer.invokeElementMethod(
            this.fileInput.nativeElement, 'dispatchEvent', [clickevent],
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
     * @return {Promise<boolean>}
     */
    public async handleFileChange(event): Promise<boolean> {
        if (this.disabled) {
            return;
        }
        /* Check. */
        if (event.target && event.target.files) {
            const invalidFileNames = [];
            let validFiles = [];
            _.each(event.target.files, ((file, fileIndex) => {
                if (!this.isValidFileSize(file)) {
                    invalidFileNames.push(file.name);
                } else {
                    validFiles.push(file);
                }
            }).bind(this));

            if (invalidFileNames.length > 0) {
                let message = '';

                if (invalidFileNames.length > 1) {
                    message += this.translate.translate(
                        'Files \'@invalidFileNames@\' exceed maximum size of upload',
                        { invalidFileNames: invalidFileNames.join('\', \'') });
                }

                if (invalidFileNames.length === 1) {
                    message += this.translate.translate(
                        'File \'@invalidFileNames@\' exceeds maximum size of upload',
                        { invalidFileNames: invalidFileNames.join('\', \'') });
                }

                this.showAlert(
                    message,
                    'error',
                );
            }

            // check image constraint
            validFiles = await this.checkImageConstraint(validFiles);

            // check image constraint
            validFiles = this.checkFileType(validFiles);

            if (validFiles.length < 1) {
                return;
            }

            /* Set the uploaded files. */
            this.addFiles(validFiles);

            /* Process the files. */
            this.handleConversion();
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
    private addFiles(files): void {
        if (this.disabled) {
            return;
        }

        /* Loop over each... */
        for (const file of files) {
            /* ...and push. */
            if (!this.multiple && this.uploadedFiles.length > 0) {
                continue;
            }
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
    private handleConversion(): void {
        if (this.disabled) {
            return;
        }
        /* Process files. */
        this.encodedFiles = this.uploadedFiles;
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
    public stopPropagation(event): boolean {
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
    public onDragEnter(event): void {
        if (this.disabled) {
            return;
        }
        /* Change the hovering state. */
        this.isHovering = true;

        /* Update the prompt text. */
        this.uploadPrompt = this.translate.translate('Drop your files to add them');
    }

    /**
     * On Drag Enter
     * -------------
     * Handles a user dragging files over the drop zone but reverse.
     *
     * @param {event} object - An object of the event.
     */
    public onDragLeave(event): void {
        if (this.disabled) {
            return;
        }
        /* Change the hovering state. */
        this.isHovering = false;

        /* Update the prompt text. */
        this.uploadPrompt = this.translate.translate('Drag and Drop a file here, or Click to Upload');
    }

    /**
     * Clear Files
     * -----------
     * Clears a file from the file drop list.
     *
     * @param {index} number - The index of the file in the array to be removed.
     */
    public clearFiles(index): void {
        if (this.disabled) {
            return;
        }
        /* If we're not mutliple, then just reset the form. */
        if (!this.multiple) {
            this.formElem.nativeElement.reset();
        }

        /* Set removing file flag. */
        this.removingFile = true;

        /* Slice the encoded files. */
        this.encodedFiles = [
            ...this.encodedFiles.slice(0, index),
            ...this.encodedFiles.slice(index + 1, this.encodedFiles.length),
        ];

        /* Slice the uploaded files. */
        this.uploadedFiles = [
            ...this.uploadedFiles.slice(0, index),
            ...this.uploadedFiles.slice(index + 1, this.uploadedFiles.length),
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

    clearPreset(): void {
        if (this.disabled) {
            return;
        }
        this.preset = null;
        this.formControl.patchValue(null);
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
    private base64Files(files, callback): void {
        /* Variables. */
        let file;
        let myReader: FileReader;
        let grandTotal = 0;

        /* Return if no files. */
        if (!files.length) {
            return;
        }

        /* If multiple, only do the first. */
        if (!this.multiple) {
            files = [files[0]];
        }

        /* Reset silent encoded files. */
        this.silentEncodedFiles = [];

        /* Loop over files. */
        for (let i = 0; i < files.length; i += 1) {
            /* Set a pointer. */
            file = files[i];

            /* Check for file. */
            if (!file || file.status === 'uploaded-file') {
                continue;
            }

            /* Add to the grand total, used to check later. */
            grandTotal += 1;

            /* Instatiate a new reader. */
            myReader = new FileReader();

            /* Set on load handler and bind this. */
            myReader.onload = this.handleFileConverted.bind(this);

            /* Process the file. */
            myReader.readAsBinaryString(file);
        }

        /* Now wait for all files to be done. */
        this.processInterval = setInterval(
            () => {
                /* Check if the files have been processed. */
                if (grandTotal === this.silentEncodedFiles.length) {
                    /* If they're all done, clear this interval. */
                    clearInterval(this.processInterval);

                    /* Let's loop over the files.... */
                    let j = 0;
                    for (let i = 0; i < files.length; i += 1) {
                        /* ...continue if no file... */
                        if (!files[i] || files[i].status === 'uploaded-file') {
                            continue;
                        }

                        /* ...if we have a file, add the meta data back... */
                        if (this.silentEncodedFiles[j]) {
                            this.silentEncodedFiles[j].name = files[i].name;
                            this.silentEncodedFiles[j].lastModified = files[i].lastModified;
                            this.silentEncodedFiles[j].status = files[i].status;
                            this.silentEncodedFiles[j].filePermission = this.filePermission;
                            this.silentEncodedFiles[j].id = i;
                            this.silentEncodedFiles[j].mimeType = files[i].type;

                        }
                        j += 1;
                    }

                    /* Call the callback, when done. */
                    callback(this.silentEncodedFiles);
                }
            },
            250,
        ); // 250 to save the lag spike during upload.
    }

    /**
     * Emit Files Event
     * ----------------
     * Triggers an emission of the encoded files array.
     *
     * @return {void}
     */
    private emitFilesEvent() {
        /* Emit the event up a level. */
        this.onDropFiles.emit({
            target: this,
            files: this.encodedFiles,
        });

        /* Also patch the form control value. */
        this.formControl.patchValue(this.encodedFiles);
    }

    /**
     * Handle File Converted
     * ---------------------
     * A handler for the fileReader used to encode the files.
     *
     * @param  {readerEvt} object - the reader event object.
     * @return {void}
     */
    private handleFileConverted(readerEvt): void {
        /* Encode the raw data in base64. */
        const base64data = btoa(readerEvt.target.result);

        /* Push the file object into the encodedFiles array. */
        this.silentEncodedFiles.push({ data: base64data });
    }

    /**
     * Update Files Text
     * -----------------
     * Updates the text that tells the user how many files they've uploaded.
     *
     * @return {void}
     */
    private updateFilesText(): void {
        /* Update. */
        if (!this.uploadedFiles || this.uploadedFiles.length === 0) {
            this.numberFilesText = this.translate.translate(
                'No @fileContext@ selected',
                {
                    fileContext: (this.multiple && this.uploadedFiles.length > 1 ? 'files' : 'file'),
                },
            );
        } else {
            this.numberFilesText = this.translate.translate(
                '@fileCount@ @fileContext@ selected',
                {
                    fileCount: this.uploadedFiles.length,
                    fileContext: (this.multiple && this.uploadedFiles.length > 1 ? 'files' : 'file'),
                },
            );
        }

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
        if (this.uploadedFiles[fileIndex]) {
            this.uploadedFiles[fileIndex].status = status;
        }
        if (this.encodedFiles[fileIndex]) {
            this.encodedFiles[fileIndex].status = status;
        }
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

    /**
     * Check if images match the images constraint. if any of the image not match, we remove them from the image list,
     * and show warning message.
     * @param {File[]} files
     * @return {Promise<File[]>}
     */
    async checkImageConstraint(files: File[]): Promise<File[]> {
        if (this.imageConstraint) {
            const validImages = [];
            const invalidImageNames = [];
            for (const file of files) {
                const imageSize = await getImageSize(file);
                if (imageSize.width === this.imageConstraint.width && imageSize.width === this.imageConstraint.width) {
                    validImages.push(file);
                } else {
                    invalidImageNames.push(file.name);
                }
            }

            if (invalidImageNames.length > 0) {
                const message = this.translate.translate(
                    'The dimension of @invalidImageNames@ must be @imageConstraintWidth@ x @imageConstraintHeight@.',
                    {
                        invalidImageNames: invalidImageNames.join("' '"),
                        imageConstraintWidth: this.imageConstraint.width,
                        imageConstraintHeight: this.imageConstraint.height,
                    },
                );

                this.showAlert(
                    message,
                    'error',
                );
            }

            return validImages;
        }

        return files;
    }

    /**
     * Check if file type match the allowFileTypes. if any of the file not match, we remove them from the file list,
     * and show warning message.
     * @param {File[]} files
     * @return {Promise<File[]>}
     */
    checkFileType(files) {
        if (this.allowFileTypes) {
            const validFiles = [];
            const invalidFileNames = [];
            for (const file of files) {
                if (this.allowFileTypes.includes(file.type)) {
                    validFiles.push(file);
                } else {
                    invalidFileNames.push(file.name);
                }
            }

            if (invalidFileNames.length > 0) {
                const message = this.translate.translate(
                    'The file type of @invalidFileNames@ must be one of @allowFileTypes@.',
                    {
                        invalidFileNames: invalidFileNames.join("' '"),
                        allowFileTypes: this.allowFileTypes.join("' '"),
                    },
                );

                this.showAlert(
                    message,
                    'error',
                );
            }

            return validFiles;
        }

        return files;
    }
}

/**
 * Get image size with observable
 * @param {blob} file
 * @return {Promise<{width: number; height: number}>}
 */
function getImageSize(file): Promise<{width: number; height: number}> {
    return new Promise<{ width: number; height: number; }>((resolve, reject) => {
        try {
            createImageBitmap(file).then((data: {width: number; height: number}) => {
                resolve(data);
            });
        } catch (e) {
            reject(false);
        }
    });
}
