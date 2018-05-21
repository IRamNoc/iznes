import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FileViewerComponent} from './fileviewer.component';
import {FileViewerPreviewComponent} from './preview-modal/component';
import {FileViewerPreviewService} from './preview-modal/service';
import {ClarityModule} from '@clr/angular';

@NgModule({
    declarations: [
        FileViewerComponent,
        FileViewerPreviewComponent
    ],
    exports: [
        FileViewerComponent,
        FileViewerPreviewComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        ClarityModule
    ],
    providers: [
        FileViewerPreviewService
    ]
})
export class FileViewerModule {
}
