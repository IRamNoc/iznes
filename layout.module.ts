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
import {UiModalComponent} from './layouts/ui-form/components/modal/modal.component';
import {UiButtonComponent} from './layouts/ui-form/components/button/button.component';
import {UiToasterComponent} from './layouts/ui-form/components/toaster/toaster.component';

import {UiColourComponent} from './layouts/ui-form/components/colour/colour.component';
import {UiFormPersistComponent} from './layouts/ui-form/components/form-persist/form-persist.component';
import {UiIconsComponent} from './layouts/ui-form/components/icons/icons.component';
import {UiLayout1Component} from './layouts/ui-form/components/layout1/layout1.component';
import {UiLayout2Component} from './layouts/ui-form/components/layout2/layout2.component';
import {UiTextComponent} from './layouts/ui-form/components/text/text.component';
import {UiExpandableComponent} from './layouts/ui-form/components/expandable/expandable.component';

/* Directives. */
import {DropdownDirective} from './menu-dropdown/menu-dropdown.directive';
/* Services. */
import {MenuDropdownService} from './menu-dropdown/menu-dropdown.service';

import {SidebarModule} from 'ng-sidebar';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule, SetlPipesModule, SetlDirectivesModule, SetlComponentsModule} from '@setl/utils';
import {ClarityModule} from '@clr/angular';
import {MultilingualModule} from '@setl/multilingual/multilingual.module';

/* Import the persist module. */
import {PersistModule} from '@setl/core-persist';

import {MockFundService} from './layouts/ui-form/components/layout2/fund.mock.service';

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
        SetlDirectivesModule,
        MultilingualModule,
        PersistModule,
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
        UiModalComponent,
        UiButtonComponent,
        UiToasterComponent,
        UiColourComponent,
        UiFormPersistComponent,
        UiIconsComponent,
        UiLayout1Component,
        UiLayout2Component,
        UiTextComponent,
        UiExpandableComponent
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
        UiButtonComponent,
        UiModalComponent,
        UiToasterComponent,
        UiColourComponent,
        UiFormPersistComponent,
        UiIconsComponent,
        UiLayout1Component,
        UiLayout2Component,
        UiTextComponent,
        UiExpandableComponent
    ],
    providers: [
        /* Services. */
        MenuDropdownService,
        MockFundService
    ],
})
export class SetlLayoutModule {

}

