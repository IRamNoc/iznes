/* Core imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

/* Service. */
import {PersistService} from './service/service';

/* Component. */
import {PersistControlsComponent} from './controls/component';

/* Directive. */
import {PersistDirective} from './directive/directive';

/* Persist Module. */
@NgModule({
    declarations: [
        /* Controls. */
	    PersistControlsComponent,
	    PersistDirective
    ],
    exports: [
        /* Controls. */
        PersistControlsComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        ClarityModule
    ],
    providers: []
})

export class PersistModule {}
