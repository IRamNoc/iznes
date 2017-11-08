/* Core/Angular imports. */
import {NgModule} from "@angular/core";
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

/* Clarity module. */
import {ClarityModule} from 'clarity-angular';

/* Components. */
import {OfiHomeComponent} from './home/component';

/* Decorator. */
@NgModule({
    declarations: [
        OfiHomeComponent,
    ],
    exports: [
        OfiHomeComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        ClarityModule,
        RouterModule,
    ],
    providers: []
})

/* Class. */
export class OfiHomeModule {

}
