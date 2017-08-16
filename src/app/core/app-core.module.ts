/**
 * App Core Module
 * This module contains all the core layouts and components that aren't pages,
 * such as a navbar, footer or regularly used components.
 **/

/* Core imports. */
import {
    NgModule,
    CommonModule
} from '@angular/core';

/* Layout Components. */
import {BlankLayoutComponent} from './layouts/blank/blank.component';
import {BasicLayoutComponent} from './layouts/basic/basic.component';

@NgModule({
    declarations: [
        BlankLayoutComponent,
        BasicLayoutComponent
    ],
    imports: [
        CommonModule,
        BlankLayoutComponent,
        BasicLayoutComponent
    ],
    exports: [
        FormElementsComponent,
        BlankLayoutComponent,
        BasicLayoutComponent
    ],
    providers: [
        /* Services. */
    ],
})
export class AppCoreModule {

}
