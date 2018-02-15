import {NgModule} from '@angular/core';
/* Layout Components. */
import {BlankLayoutComponent} from './layouts/blank/blank.component';
import {BasicLayoutComponent} from './layouts/basic/basic.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CounterTileComponent} from './dashboard/tiles/counter-tile.component';
import {BasicTileComponent} from './dashboard/tiles/basic-tile.component';
/* Navigation Components. */
import {NavigationSidebarComponent} from './navigation-sidebar/navigation-sidebar.component';
import {NavigationTopbarComponent} from './navigation-topbar/navigation-topbar.component';

import {HomeComponent} from './home/home.component';
import {FormElementsComponent} from './ui-elements/form-elements.component';
import {UiInfoPaneComponent} from './layouts/ui-form/info-pane/info-pane.component';
import {UiTabsComponent} from './layouts/ui-form/components/tabs/tabs.component';
import {UiFormsComponent} from './layouts/ui-form/components/forms/forms.component';
import {UiDropdownsComponent} from './layouts/ui-form/components/dropdowns/dropdowns.component';
import {UiDataGridComponent} from './layouts/ui-form/components/datagrid/datagrid.component';
import {UiAlertsComponent} from './layouts/ui-form/components/alerts/alerts.component';
import {UiToasterComponent} from './layouts/ui-form/components/toaster/toaster.component';
/* Directives. */
import {DropdownDirective} from './menu-dropdown/menu-dropdown.directive';
/* Services. */
import {MenuDropdownService} from './menu-dropdown/menu-dropdown.service';

import {SidebarModule} from 'ng-sidebar';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule, SetlPipesModule, SetlComponentsModule} from '@setl/utils';
import {ClarityModule} from '@clr/angular';
import {MultilingualModule} from '@setl/multilingual/multilingual.module';

@NgModule({
    imports: [
        RouterModule,
        SidebarModule.forRoot(),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        ClarityModule,
        SetlPipesModule,
        SetlComponentsModule,
        MultilingualModule,
    ],
    declarations: [
        /* Directives. */
        DropdownDirective,

        /* Components. */
        BlankLayoutComponent,
        BasicLayoutComponent,
        NavigationSidebarComponent,
        NavigationTopbarComponent,
        DashboardComponent,
        CounterTileComponent,
        BasicTileComponent,
        HomeComponent,
        FormElementsComponent,
        UiInfoPaneComponent,
        UiTabsComponent,
        UiFormsComponent,
        UiDropdownsComponent,
        UiDataGridComponent,
        UiAlertsComponent,
        UiToasterComponent
    ],
    exports: [
        /* Directives. */
        DropdownDirective,

        /* Components. */
        BlankLayoutComponent,
        BasicLayoutComponent,
        NavigationSidebarComponent,
        NavigationTopbarComponent,
        DashboardComponent,
        CounterTileComponent,
        HomeComponent,
        FormElementsComponent,
        UiInfoPaneComponent,
        UiTabsComponent,
        UiFormsComponent,
        UiDropdownsComponent,
        UiDataGridComponent,
        UiAlertsComponent,
        UiToasterComponent
    ],
    providers: [
        /* Services. */
        MenuDropdownService
    ],
})
export class SetlLayoutModule {

}

