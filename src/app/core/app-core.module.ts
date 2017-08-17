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

/* Layout Components. */
import {BlankLayoutComponent} from './layouts/blank/blank.component';
import {BasicLayoutComponent} from './layouts/basic/basic.component';

/* Navigation Components. */
import {NavigationSidebarComponent} from './navigation-sidebar/navigation-sidebar.component';
import {NavigationTopbarComponent} from './navigation-topbar/navigation-topbar.component';

/* Directives. */
import {DropdownDirective} from './menu-dropdown/menu-dropdown.directive';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SidebarModule,
        SelectModule,
        ClarityModule
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
    ],
})
export class AppCoreModule {

}