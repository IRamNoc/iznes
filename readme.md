#What is file drop ?
File drop is an in-house component that basically enhances the native file type input.

Features:
* Click to add files.
* Drop files onto dropzone.
* Clear selected files from list.

# Usage:
## 1. Importing the FileDropModule

Import the `FileDropModule` into your module by using an import statement and adding it to the imports array.

```typescript
import {
    FileDropModule
} from '@setl/core-filedrop';

@NgModule({
    imports: [
        FileDropModule,
    ],
})
```

## 2. Using the component.

An example component being used.

```html
<setl-file-drop
    (onDrop)="functionInYourComponent($event)"
    [multiple]="true"
    [formControl]="yourFormGroup.controls['controlName']"
></setl-file-drop>
```

#### The `onDrop` event

Interfaces can be found in the FileDrop.ts
Here's what you need to know for onDrop events:

```typescript
export enum FilePermission {
    Public = 0,
    Private = 1,
}

export interface File {
    data: string; // base64
    filePermission: FilePermission;
    id: number;
    lastModified: number; // timestamp
    name: string;
    status: 'uploaded-file'|null;
    mimeType: string;
}

export interface FileDropEvent {
    target: DropHandler;
    files: File[];
}
```

#### The `multiple` property.

This property allows the file drop component to accept multiple files,  **it's `false` by default**. Specifying true allows multiple files to be selected on click and accepted on dropping many'
Note that whether this is true or false, the emitted array will always be an array, of either one or multiple file objects.

#### The `formControl` property.

The `formControl` can be set to a custom FormControl of your choice, instead of emitting an event, the files array will be patched into the value of your FormControl.

#### The `inline` property.

The `inline` specify the file drop component render as inline input in a form 

### The `usePreview` property.

The `usePreview` specify that we want the file (only support image atm) render with preview.

example on using preview: 
```html
<setl-file-drop class="form-control" id="mc_logo" [formControl]="managementCompanyForm.controls['logo']"
             (onDrop)="onDropFile($event, 'logo')" [preset]="{ name: fileMetadata.getTitle('logo'), fileBase64: fileMetadata.getHash('logo') }"
             [inline]="true"
             [usePreview]="true"
             [allowFileTypes]="['image/png', 'image/jpeg']"
             ngDefaultControl></setl-file-drop>
```

### The `allowFileTypes` property.
The `allowFileTypes` specify what file types we allow.

Your HTML:
```html
<setl-file-drop
    [formControl]="formGroup.controls['controlName']"
></setl-file-drop>
```

Your component:
```typescript
class MyComponent {

    private formGroup: FormGroup;

    constructor () {
        this.formGroup = new FormGroup({
            'controlName': new FormControl([]),
        })
    }
}
```
