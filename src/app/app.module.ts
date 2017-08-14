import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, FormControl, NgModel, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from 'clarity-angular';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';

import {SidebarModule} from 'ng-sidebar';

/* Connection Services */
import {MemberSocketService} from '@setl/websocket-service';
import {WalletNodeSocketService} from '@setl/websocket-service';

/* Core services*/
import {MyUserService} from '@setl/core-req-services';

/* Routes. */
import {ROUTES} from './app.routes';

/* SETL Modules. */
import {SetlLoginModule} from '@setl/core-login';

/* Components. */
import {AppComponent} from './app.component';

import {FormElementsComponent} from './ui-elements/form-elements.component';
import {BasicLayoutComponent} from './core/layouts/basic/basic.component';
import {BlankLayoutComponent} from './core/layouts/blank/blank.component';
import {NavigationTopbarComponent} from './core/navigation-topbar/navigation-topbar.component';
import {NavigationSidebarComponent} from './core/navigation-sidebar/navigation-sidebar.component';

import {SelectModule} from 'ng2-select';
import {HomeComponent} from './home/home.component';

/* UserAdmin Module. */
import {UserAdminModule} from '@setl/core-useradmin';

/* Dropdown Directive. */
import {DropdownDirective} from './core/dropdown/dropdown.directive';

/**
 * App main state
 */
import {NgRedux, NgReduxModule} from '@angular-redux/store';

import {
    createAppStore,
    appSaga,
    sagaMiddleware
} from './store/app.store';

import {AppState} from './store/app.reducer';


@NgModule({
    declarations: [
        /* Directives. */
        DropdownDirective,

        /* Components. */
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
        UserAdminModule,
        SidebarModule,
        NgReduxModule,
        ReactiveFormsModule,
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        MemberSocketService,
        WalletNodeSocketService,
        MyUserService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(ngRedux: NgRedux<AppState>) {
        ngRedux.provideStore(createAppStore());
        sagaMiddleware.run(appSaga);
    }
}
