import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, FormControl, NgModel} from '@angular/forms';
import {ClarityModule} from 'clarity-angular';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';

/* Routes. */
import {ROUTES} from "./app.routes";

/* SETL Modules. */
import { SetlLoginModule } from '@setl/core-login';

/* Components. */
import {AppComponent} from './app.component';
import {FormElementsComponent} from './ui-elements/form-elements.component';
import {BasicLayoutComponent} from './core/layouts/basic/basic.component';
import {BlankLayoutComponent} from './core/layouts/blank/blank.component';
import { NavigationTopbarComponent } from './core/navigation-topbar/navigation-topbar.component';
import { NavigationSidebarComponent } from './core/navigation-sidebar/navigation-sidebar.component';

import {SelectModule} from 'ng2-select';
import {HomeComponent} from './home/home.component';
@NgModule({
    declarations: [
        AppComponent,
        FormElementsComponent,
        BasicLayoutComponent,
        BlankLayoutComponent,
        HomeComponent,
        NavigationTopbarComponent,
        NavigationSidebarComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        ClarityModule.forRoot(),
        RouterModule.forRoot(ROUTES),
        SelectModule,
        SetlLoginModule,
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {

}
