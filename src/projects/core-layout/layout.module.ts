import { NgModule } from '@angular/core';
/* Layout Components. */
import { BlankLayoutComponent } from './layouts/blank/blank.component';
import { BasicLayoutComponent } from './layouts/basic/basic.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CounterTileComponent } from './dashboard/tiles/counter-tile.component';
import { BasicTileComponent } from './dashboard/tiles/basic-tile.component';
/* Navigation Components. */
import { NavigationSidebarComponent } from './navigation-sidebar/navigation-sidebar.component';
import { NavigationTopbarComponent } from './navigation-topbar/navigation-topbar.component';
import { NavigationFooterComponent } from './navigation-footer/footer.component';

import { HomeComponent } from './home/home.component';

/* Directives. */
import { DropdownDirective } from './menu-dropdown/menu-dropdown.directive';
/* Services. */
import { MenuDropdownService } from './menu-dropdown/menu-dropdown.service';

import { SidebarModule } from 'ng-sidebar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    SelectModule,
    SetlComponentsModule,
    SetlDirectivesModule,
    SetlPipesModule,
    SetlServicesModule,
} from '@setl/utils';
import { BlockchainStatusTrackerModule } from '@setl/utils/components/blockchain-status-tracker/module';
import { ConnectionStatusAlertsModule } from '@setl/utils/components/connection-status-alerts/module';
import { ClarityModule } from '@clr/angular';
import { MultilingualModule } from '@setl/multilingual/multilingual.module';
/* Import the persist module. */
import { PersistModule } from '@setl/core-persist';

import { FileDropModule } from '@setl/core-filedrop';
import { FileViewerModule } from '@setl/core-fileviewer';

import { AlertsComponent } from './alerts/alerts.component';
import { DatagridListModule } from '@setl/utils/components/datagrid-list/datagrid-list-module';

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
        SetlServicesModule,
        FileDropModule,
        FileViewerModule,
        BlockchainStatusTrackerModule,
        ConnectionStatusAlertsModule,
        DatagridListModule,
    ],
    declarations: [
        /* Directives. */
        DropdownDirective,

        /* Components. */
        BlankLayoutComponent,
        BasicLayoutComponent,
        NavigationSidebarComponent,
        NavigationTopbarComponent,
        NavigationFooterComponent,
        DashboardComponent,
        CounterTileComponent,
        BasicTileComponent,
        HomeComponent,
        AlertsComponent,
    ],
    exports: [
        /* Directives. */
        DropdownDirective,

        /* Components. */
        BlankLayoutComponent,
        BasicLayoutComponent,
        NavigationSidebarComponent,
        NavigationTopbarComponent,
        NavigationFooterComponent,
        DashboardComponent,
        CounterTileComponent,
        HomeComponent,
    ],
    providers: [
        /* Services. */
        MenuDropdownService,
    ],
})

export class SetlLayoutModule {}
