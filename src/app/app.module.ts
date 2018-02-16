import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ErrorHandler, NgModule} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {RouterModule} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {LoginGuardService} from '@setl/core-login';
import {HttpModule} from '@angular/http';
import {SidebarModule} from 'ng-sidebar';

import {GlobalErrorHandler} from '../error_handler';

import {
    APP_CONFIG,
    SelectModule,
    SetlComponentsModule,
    SetlDirectivesModule,
    SetlPipesModule,
    SetlServicesModule
} from '@setl/utils';

import {NgxPaginationModule} from 'ngx-pagination';
/* Connection Services */
import {MemberSocketService, WalletNodeSocketService} from '@setl/websocket-service';
/* Core services*/
import {
    AccountsService,
    ChainService,
    ChannelService,
    FileService,
    InitialisationService,
    MemberService,
    MyUserService,
    MyWalletsService,
    PdfService,
    PermissionGroupService,
    WalletnodeChannelService,
    WalletNodeRequestService,
    WalletnodeTxService
} from '@setl/core-req-services';
/* Routes. */
import {ROUTES} from './app.routes';
/* SETL Modules. */
import {SetlMessagesModule} from '@setl/core-messages';
import {SetlAccountModule} from '@setl/core-account';
import {SetlBalancesModule} from '@setl/core-balances';
import {UserAdminModule} from '@setl/core-useradmin';
import {AssetServicingModule} from '@setl/asset-servicing';
import {PermissionGridModule} from '@setl/permission-grid';
import {CoreManageMemberModule} from '@setl/core-manage-member';
import {CorpActionsModule} from '@setl/core-corp-actions';
import {T2sModule} from '@setl/core-t2s';
import {ConnectionsModule} from '@setl/core-connections/connections.module';
import {CoreWorkflowEngineModule} from '@setl/core-wfe';
import {SetlLayoutModule} from '@setl/core-layout';
/* OFI Modules */
import {OfiProductModule} from '@ofi/product';
import {OfiMainModule} from '@ofi/ofi-main';
/* Internal Components. */
import {AppComponent} from './app.component';
/**
 * Vendor Modules and Services.
 */
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {JasperoAlertsModule} from '@setl/jaspero-ng2-alerts';
/**
 * App main state
 */
import {NgRedux, NgReduxModule} from '@angular-redux/store';

import {appSaga, createAppStore, sagaMiddleware} from './store/app.store';

import {AppState} from './store/app.reducer';
/**
 * Environment
 */
import {environment} from '../environments/environment';

/**
 * Membersocket service factory
 */
export function memberSocketServiceFactory() {
    const memberSocketService = new MemberSocketService();
    memberSocketService.updateConfig(
        environment.MEMBER_NODE_CONNECTION.host,
        environment.MEMBER_NODE_CONNECTION.port,
        environment.MEMBER_NODE_CONNECTION.path
    );

    return memberSocketService;
}

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
        ClarityModule,
        RouterModule.forRoot(ROUTES),
        SelectModule,
        ToasterModule,
        JasperoAlertsModule,
        NgReduxModule,
        NgxPaginationModule,
        SidebarModule.forRoot(),

        /* External modules */
        UserAdminModule,
        SetlMessagesModule,
        SetlAccountModule,
        OfiProductModule,
        AssetServicingModule,
        SetlBalancesModule,
        PermissionGridModule,
        SetlPipesModule,
        CoreManageMemberModule,
        SetlComponentsModule,
        CorpActionsModule,
        OfiMainModule,
        SetlDirectivesModule,
        SetlServicesModule,
        ConnectionsModule,
        CoreWorkflowEngineModule,
        T2sModule,
        SetlLayoutModule,
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        },
        {provide: LocationStrategy, useClass: HashLocationStrategy},

        {
            provide: MemberSocketService,
            useFactory: memberSocketServiceFactory
        },

        {
            provide: APP_CONFIG,
            useValue: environment
        },

        WalletNodeSocketService,
        MyUserService,
        MyWalletsService,
        WalletnodeTxService,
        WalletNodeRequestService,
        ToasterService,
        ChannelService,
        AccountsService,
        PermissionGroupService,
        MemberService,
        ChainService,
        WalletnodeChannelService,
        InitialisationService,
        FileService,
        PdfService,
        LoginGuardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(ngRedux: NgRedux<AppState>) {
        ngRedux.provideStore(createAppStore());
        sagaMiddleware.run(appSaga);
    }
}
