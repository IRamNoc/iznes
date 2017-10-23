/* Core/Angular imports. */
import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

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
    ],
    providers: []
})

/* Class. */
export class OfiHomeModule {

}
