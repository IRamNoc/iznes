# What is file drop?
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
        FileDropModule
    ]
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

The on drop event is the standard way to recieve data from the file drop component, it emits an event object with a files property, an array of file objects.

Here's an example of an event object with the files array in it;

```typescript
{
    'files': [
        {
            "data": "aGVsbG8gdGhlcmUh",
            "name": "example.txt",
            "lastModified": 1507563924000
            
        }
    ]
}
```

#### The `multiple` property.

This propery allows the file drop component to accept multiple files, **it's `false` by default**. Specifying true allows multiple files to be selected on click and accepted on dropping many.
Note that whether this is true or false, the emitted array will always be an array, of either one or multiple file objects.

#### The `formControl` property.

The `formControl` can be set to a custom FormControl of your choice, instead of emitting an event, the files array will be patched into the value of your FormControl.

Your HTML:
```html
<setl-file-drop
    [formControl]="formGroup.controls['controlName']"
></setl-file-drop>
```

Your component:
```typescript
class MyComponent {
    // Delcare the property.
    private formGroup:FormGroup;
    
    // Assign it in the contstructor.
    constructor () {
        this.formGroup = new FormGroup({
            'controlName': new FormControl([]),
        })
    }
}
```
