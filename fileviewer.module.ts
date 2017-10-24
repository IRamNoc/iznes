import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FileViewerComponent} from './fileviewer.component';
import {ClarityModule} from 'clarity-angular';
@NgModule({
    declarations: [
        FileViewerComponent
    ],
    exports: [
        FileViewerComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        ClarityModule
    ],
    providers: []
})
export class FileViewerModule {
}
