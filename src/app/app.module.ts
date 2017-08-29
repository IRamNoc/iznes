import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, FormControl, NgModel, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from 'clarity-angular';
import {AlertIconAndTypesService} from 'clarity-angular/emphasis/alert/providers/icon-and-types-service';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HttpModule} from '@angular/http';

/* Connection Services */
import {MemberSocketService} from '@setl/websocket-service';
import {WalletNodeSocketService} from '@setl/websocket-service';

/* Core services*/
import {
    MyUserService,
    WalletNodeRequestService,
    MyWalletsService,
    WalletnodeTxService,
    ChannelService
} from '@setl/core-req-services';

/* Routes. */
import {ROUTES} from './app.routes';

/* SETL Modules. */
import {SetlLoginModule} from '@setl/core-login';
import {LoginGuardService} from '@setl/core-login';
import {SetlMessagesModule} from '@setl/core-messages';
import {SetlBalancesModule} from '@setl/core-balances';
import {UserAdminModule} from '@setl/core-useradmin';
import {AssetServicingModule} from '@setl/asset-servicing';
import {PermissionGridModule} from '@setl/permission-grid';

/* Internal App Modules. */
import {AppCoreModule} from './core/app-core.module';
import {AppViewsModule} from './app-views.module';

/* Internal Components. */
import {AppComponent} from './app.component';

/**
 * Vendor Modules and Services.
 */
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {SelectModule} from 'ng2-select';
import {JasperoAlertsModule} from '@setl/jaspero-ng2-alerts';

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
        /* Components. */
        AppComponent
    ],
    imports: [
        /* Vendor/Angular */
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        FormsModule,
        ClarityModule.forRoot(),
        RouterModule.forRoot(ROUTES),
        SelectModule,
        ToasterModule,
        JasperoAlertsModule,
        NgReduxModule,
        ReactiveFormsModule,

        /* Internal modules. */
        AppCoreModule,
        AppViewsModule,

        /* External modules */
        SetlLoginModule,
        UserAdminModule,
        SetlMessagesModule,
        AssetServicingModule,
        SetlBalancesModule,
        PermissionGridModule
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
        MyWalletsService,
        WalletnodeTxService,
        WalletNodeRequestService,
        LoginGuardService,
        ToasterService,
        ChannelService,
        AlertIconAndTypesService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(ngRedux: NgRedux<AppState>) {
        ngRedux.provideStore(createAppStore());
        sagaMiddleware.run(appSaga);
    }
}
