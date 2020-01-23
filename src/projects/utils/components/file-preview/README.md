## Overview
This is an angular component for render the preview of files, currently only support 'image/png', 'image/jpeg'.

## Usage

### In module.ts
```typescript
import { SetlComponentsModule } from '@setl/utils';
...
@NgModule({
    ...
    imports: [
        ...
        SetlComponentsModule,
    ]
})
```

### In html
```
<file-preview *ngIf="usePreview" [fileDataString]="preset.fileBase64"></file-preview>
```
