/* Core imports. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

/* Import the dropfile component. */
import { FileDropComponent } from './filedrop.component';
import { DropHandler } from './drophandler/drophandler.component';

import { SetlComponentsModule } from '@setl/utils';

/* User admin service. */
@NgModule({
    declarations: [
        /* Dropfile components. */
        DropHandler,
        FileDropComponent,
    ],
    exports: [
        /* Dropfile components. */
        DropHandler,
        FileDropComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        SetlComponentsModule,
    ],
    providers: [],
})

export class FileDropModule {

}
