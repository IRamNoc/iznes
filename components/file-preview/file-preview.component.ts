import { Component, Input } from '@angular/core';

// support MIME type
type supportMimeType = 'image/png'|'image/jpeg'|'application/pdf';
type unknownFileMimeType = 'unknown type';
interface FileUploadObject {
    data: string;
    name: string;
    lastModified: number;
    filePermission: number;
    mimeType: string;
}

@Component({
    selector: 'file-preview',
    template: `
        <ng-container [ngSwitch]="fileMimeType">
            <ng-container *ngSwitchCase="'image/png'">
                <img class="preview-container" [src]="fileDataBase64" height="95%">
            </ng-container>
            <ng-container *ngSwitchCase="'image/jpeg'">
                <img class="preview-container" [src]="fileDataBase64"  height="95%">
            </ng-container>
            <ng-container *ngSwitchCase="'application/pdf'">
                {{fileName}}
            </ng-container>
            <ng-container *ngSwitchCase="'unknown type'">
                {{fileName}}
            </ng-container>
        </ng-container>
    `,
    styleUrls: ['./file-preview.scss'],
})
export class FilePreviewComponent {

    static unknownType : unknownFileMimeType = 'unknown type';

    // example data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyoAAAFOCAYAAABpM
    @Input()
    fileDataString;

    // file name
    @Input()
    fileName = 'file';

    @Input()
    fileUploadObj: FileUploadObject;

    get fileDataBase64() {
        if (this.fileUploadObj) {
            return `data:${this.fileUploadObj.mimeType};base64,${this.fileUploadObj.data}`;
        }

        return this.fileDataString;
    }

    /**
     * Get MIME type of the file
     * @return {supportMimeType | unknownFileMimeType}
     */
    get fileMimeType(): supportMimeType | unknownFileMimeType {
        try {
            // if fileUploadObj is provided, use it
            if (this.fileUploadObj) {
               return (this.fileUploadObj.mimeType as supportMimeType);
            }

            // trim out 'data:'
            return (this.fileDataString.split(':')[1].
            // get the MIME type part.
            split(';')[0] as supportMimeType);

        } catch (e) {
            return FilePreviewComponent.unknownType;
        }
    }
}
