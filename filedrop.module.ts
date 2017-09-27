/* Core imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

/* Import the dropfile component. */
import {FileDropComponent} from './filedrop.component';
import {DropHandler} from './drophandler/drophandler.component';

/* User admin service. */
@NgModule({
    declarations: [
        /* Dropfile components. */
        DropHandler,
        FileDropComponent
    ],
    exports: [
        /* Dropfile components. */
        DropHandler,
        FileDropComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
    ],
    providers: []
})

export class FileDropModule {

}
