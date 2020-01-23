/* Core imports. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
/* Local imports. */
import { PersistService } from './service/service';
import { PersistRequestService } from '@setl/core-req-services';

/* Persist Module. */
@NgModule({
    declarations: [],
    exports: [],
    imports: [
        CommonModule,
        BrowserModule,
        ClarityModule,
    ],
    providers: [
        /* Service. */
        PersistRequestService,
        PersistService,
    ],
})

export class PersistModule {
}
