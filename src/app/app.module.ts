import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SetlLoginModule, LoginGuardService } from '@setl/core-login';
import { HttpClientModule } from '@angular/common/http';
import { SidebarModule } from 'ng-sidebar';

import {
    APP_CONFIG,
    SelectModule,
    SetlComponentsModule,
    SetlDirectivesModule,
    SetlPipesModule,
    SetlServicesModule,
    GlobalErrorHandler,
} from '@setl/utils';

import { NgxPaginationModule } from 'ngx-pagination';
/* Connection Services */
import { MemberSocketService, WalletNodeSocketService } from '@setl/websocket-service';
/* Core services*/
import {
    AccountsService,
    ChainService,
    ChannelService,
    CommonRequestService,
    FileService,
    InitialisationService,
    MemberService,
    MyUserService,
    MyWalletsService,
    PdfService,
    PermissionGroupService,
    WalletnodeChannelService,
    WalletNodeRequestService,
    WalletnodeTxService,
    NodeAlertsService,
    RemoteLoggerService,
} from '@setl/core-req-services';
/* Routes. */
import { ROUTES } from './app.routes';
/* SETL Modules. */

import { SetlMessagesModule } from '@setl/core-messages';
import { SetlAccountModule } from '@setl/core-account';
import { SetlBalancesModule } from '@setl/core-balances';
import { UserAdminModule } from '@setl/core-useradmin';
import { CoreAccountAdminModule } from '@setl/core-account-admin';
import { AssetServicingModule } from '@setl/asset-servicing';
import { PermissionGridModule } from '@setl/permission-grid';
import { CoreManageMemberModule } from '@setl/core-manage-member';
import { ConnectionsModule } from '@setl/core-connections/connections.module';
import { SetlLayoutModule } from '@setl/core-layout';
import { LogService } from '@setl/utils';

/* OFI Modules */
import { OfiMainModule } from '@ofi/ofi-main';
/* Internal Components. */
import { AppComponent } from './app.component';
/**
 * Vendor Modules and Services.
 */
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { JasperoAlertsModule } from '@setl/jaspero-ng2-alerts';
import { FileViewerModule } from '@setl/core-fileviewer';
/**
 * App main state
 */
import { NgRedux, NgReduxModule } from '@angular-redux/store';

import { appSaga, createAppStore, sagaMiddleware } from './store/app.store';

import { AppState } from './store/app.reducer';
/**
 * Environment
 */
import { environment } from '../environments/environment';

/**
 * Membersocket service factory
 */
export function memberSocketServiceFactory() {
    const memberSocketService = new MemberSocketService();
    memberSocketService.updateConfig(
        environment.MEMBER_NODE_CONNECTION.host,
        environment.MEMBER_NODE_CONNECTION.port,
        environment.MEMBER_NODE_CONNECTION.path,
    );

    return memberSocketService;
}

@NgModule({
    declarations: [
        /* Components. */
        AppComponent,
    ],
    imports: [
        /* Vendor/Angular */
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ClarityModule,
        RouterModule.forRoot(ROUTES),
        SelectModule,
        ToasterModule,
        JasperoAlertsModule,
        FileViewerModule,
        SetlLoginModule,
        NgReduxModule,
        NgxPaginationModule,
        SidebarModule.forRoot(),

        /* External modules */
        UserAdminModule,
        SetlMessagesModule,
        SetlAccountModule,
        CoreAccountAdminModule,
        AssetServicingModule,
        SetlBalancesModule,
        PermissionGridModule,
        SetlPipesModule,
        CoreManageMemberModule,
        SetlComponentsModule,
        OfiMainModule,
        SetlDirectivesModule,
        SetlServicesModule,
        ConnectionsModule,
        SetlLayoutModule,
    ],
    providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        
        {
            provide: MemberSocketService,
            useFactory: memberSocketServiceFactory,
        },

        {
            provide: APP_CONFIG,
            useValue: environment,
        },

        NodeAlertsService,
        CommonRequestService,
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
        LoginGuardService,
        LogService,
        RemoteLoggerService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(ngRedux: NgRedux<AppState>) {
        ngRedux.provideStore(createAppStore());
        sagaMiddleware.run(appSaga);
    }
}
