/**
 * App Views Module
 * This module contains all the non external goodies for this app, this is
 * where to import page components. Also don't forget to export them.
 **/

 /* Core imports. */
 import {NgModule} from '@angular/core';
 import {CommonModule} from '@angular/common';
 import {RouterModule} from '@angular/router';
 import {ClarityModule} from 'clarity-angular';

/* Components. */
import {FormElementsComponent} from './ui-elements/form-elements.component';
import {HomeComponent} from './home/home.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ClarityModule
    ],
    declarations: [
        FormElementsComponent,
        HomeComponent
    ],
    exports: [
        FormElementsComponent,
        HomeComponent
    ],
    providers: [
        /* Services. */
    ],
})
export class AppViewsModule {

}
