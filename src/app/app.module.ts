import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
import {MyUserService, WalletNodeRequestService} from '@setl/core-req-services';

/* Routes. */
import {ROUTES} from './app.routes';

/* SETL Modules. */
import {SetlLoginModule} from '@setl/core-login';
import {LoginGuardService} from '@setl/core-login';

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
import {DropdownDirective} from './core/menu-dropdown/menu-dropdown.directive';

/**
 * Toaster service
 */
import {ToasterModule, ToasterService} from 'angular2-toaster';

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

/**
 * Environment
 */
import {environment} from '../environments/environment';

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
        BrowserAnimationsModule,
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
        ToasterModule
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},

        {
            provide: MemberSocketService,

            useFactory() {

                return new MemberSocketService(
                    environment.MEMBER_NODE_CONNECTION.host,
                    environment.MEMBER_NODE_CONNECTION.port,
                    environment.MEMBER_NODE_CONNECTION.path
                );
            }
        },

        WalletNodeSocketService,
        MyUserService,
        WalletNodeRequestService,
        LoginGuardService,
        ToasterService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(ngRedux: NgRedux<AppState>) {
        ngRedux.provideStore(createAppStore());
        sagaMiddleware.run(appSaga);
    }
}
