/* Core imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {ClarityModule} from 'clarity-angular';
/* Local imports. */
import {PersistDirective} from './directive/directive';
import {PersistService} from './service/service';

/* Persist Module. */
@NgModule({
    declarations: [
        /* Directive. */
        PersistDirective
    ],
    exports: [
        /* Directive. */
        PersistDirective
    ],
    imports: [
        CommonModule,
        BrowserModule,
        ClarityModule
    ],
    providers: [
        /* Service. */
        PersistService
    ]
})

export class PersistModule {
}
