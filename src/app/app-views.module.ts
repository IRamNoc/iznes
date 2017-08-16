/**
 * App Views Module
 * This module contains all the non external goodies for this app, this is
 * where to import page components. Also don't forget to export them.
 **/

/* Core imports. */
import {
    NgModule,
    CommonModule
} from '@angular/core';

/* Components. */
import {FormElementsComponent} from './ui-elements/form-elements.component';

@NgModule({
    declarations: [
        FormElementsComponent
    ],
    imports: [
        CommonModule,
        FormElementsComponent
    ],
    exports: [
        FormElementsComponent,
    ],
    providers: [
        /* Services. */
    ],
})
export class AppViewsModule {

}
