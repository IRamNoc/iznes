import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { SetlLoginComponent, LoginGuardService, LoginService } from '@setl/core-login';

/*import { APP_CONFIG, AppConfig, LogService, ConfirmationService } from '@setl/utils';
import { NgRedux } from '@angular-redux/store';
import {
    AccountsService,
    ChainService,
    ChannelService,
    InitialisationService,
    MyUserService,
    MyWalletsService,
    PermissionGroupService,
} from '@setl/core-req-services';
import { MemberSocketService } from '@setl/websocket-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';*/

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})
export class OfiLoginComponent extends SetlLoginComponent {
    /*
        /!* Constructor. *!/
        constructor(ngRedux: NgRedux<any>,
                    myUserService: MyUserService,
                    memberSocketService: MemberSocketService,
                    myWalletsService: MyWalletsService,
                    channelService: ChannelService,
                    accountsService: AccountsService,
                    permissionGroupService: PermissionGroupService,
                    router: Router,
                    activatedRoute: ActivatedRoute,
                    alertsService: AlertsService,
                    chainService: ChainService,
                    initialisationService: InitialisationService,
                    toasterService: ToasterService,
                    loginGuardService: LoginGuardService,
                    logService: LogService,
                    translate: MultilingualService,
                    changeDetectorRef: ChangeDetectorRef,
                    confirmationService: ConfirmationService,
                    loginService: LoginService) {
            super(
                ngRedux,
                myUserService,
                memberSocketService,
                myWalletsService,
                channelService,
                accountsService,
                permissionGroupService,
                router,
                activatedRoute,
                alertsService,
                chainService,
                initialisationService,
                toasterService,
                loginGuardService,
                logService,
                translate,
                changeDetectorRef,
                confirmationService,
                loginService,
            );
            //console.log('+++ appConfig', super.appConfig);
        }*/

}
