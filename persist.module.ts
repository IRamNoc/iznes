/* Core imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {ClarityModule} from 'clarity-angular';
/* Local imports. */
import {PersistControlsComponent} from './controls/component';
import {PersistDirective} from './directive/directive';
import {PersistService} from './service/service';

/* Persist Module. */
@NgModule({
    declarations: [
        /* Controls. */
        PersistControlsComponent,
        /* Directive. */
        PersistDirective
    ],
    exports: [
        /* Controls. */
        PersistControlsComponent,
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
