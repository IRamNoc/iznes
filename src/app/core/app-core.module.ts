/**
 * App Core Module
 * This module contains all the core layouts and components that aren't pages,
 * such as a navbar, footer or regularly used components.
 **/

/* Core imports. */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SidebarModule} from 'ng-sidebar';
import {SelectModule} from 'ng2-select';
import {ClarityModule} from 'clarity-angular';
import {ReactiveFormsModule} from '@angular/forms';

/* Layout Components. */
import {BlankLayoutComponent} from '@setl/core-layout';
import {BasicLayoutComponent} from '@setl/core-layout';

/* Navigation Components. */
import {NavigationSidebarComponent} from '@setl/core-layout';
import {NavigationTopbarComponent} from '@setl/core-layout';

/* Directives. */
import {DropdownDirective} from '@setl/core-layout';

/* Services. */
import {MenuDropdownService} from '@setl/core-layout';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SidebarModule,
        SelectModule,
        ClarityModule,
        ReactiveFormsModule
    ],
    declarations: [
        /* Directives. */
        DropdownDirective,

        /* Components. */
        BlankLayoutComponent,
        BasicLayoutComponent,
        NavigationSidebarComponent,
        NavigationTopbarComponent
    ],
    exports: [
        /* Directives. */
        DropdownDirective,

        /* Components. */
        BlankLayoutComponent,
        BasicLayoutComponent,
        NavigationSidebarComponent,
        NavigationTopbarComponent
    ],
    providers: [
        /* Services. */
        MenuDropdownService
    ],
})
export class AppCoreModule {

}
