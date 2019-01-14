import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { SetlLoginComponent, LoginGuardService, LoginService } from '@setl/core-login';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginRedirect} from "@setl/core-login/login.component";
import {NgRedux} from "@angular-redux/store";
import {MyUserService} from "@setl/core-req-services/my-user/my-user.service";
import {MemberSocketService} from "@setl/websocket-service/member-socket.service";
import {MyWalletsService} from "@setl/core-req-services/my-wallets/my-wallets.service";
import {ChannelService} from "@setl/core-req-services/channel/channel.service";
import {AccountsService} from "@setl/core-req-services/account/account.service";
import {PermissionGroupService} from "@setl/core-req-services/permission-group/permission-group.service";
import {AlertsService} from "@setl/jaspero-ng2-alerts/src/alerts.service";
import {ChainService} from "@setl/core-req-services/chain/service";
import {InitialisationService} from "@setl/core-req-services/initialisation/initialisation.service";
import {ToasterService} from "angular2-toaster";
import {LogService} from "@setl/utils/services/log/service";
import {MultilingualService} from "@setl/multilingual";
import {ConfirmationService} from "@setl/utils/components/jaspero-confirmation/confirmations.service";
import {APP_CONFIG} from "@setl/utils/appConfig/appConfig";
import {AppConfig} from "@setl/utils/appConfig/appConfig.model";
import {OfiKycService} from "../../ofi-req-services/ofi-kyc/service";
import { get as getValue } from 'lodash';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(500, style({ opacity: 1 })),
            ]),
            state('*', style({ opacity: 1 })),
        ]),
    ],
})
export class OfiLoginComponent extends SetlLoginComponent implements LoginRedirect {

    public showPassword: boolean = false;
    public showResetTwoFactor: boolean = false;
    public twoFactorResetVerified: boolean = false;
    public showModal = false;
    public resetPassword: boolean = false;
    public showTwoFactorModal = false;
    public resetTwoFactorToken = '';
    public emailSent = false;
    public isTokenExpired = false;
    public changePassword = false;
    public qrCode: string = '';
    public language: string;
    public langLabels = {
        'fr-Latn': 'Francais',
        'en-Latn': 'English',
    };

    constructor(
        private ngRedux: NgRedux<any>,
        private myUserService: MyUserService,
        private memberSocketService: MemberSocketService,
        private myWalletsService: MyWalletsService,
        private channelService: ChannelService,
        private accountsService: AccountsService,
        private permissionGroupService: PermissionGroupService,
        public router: Router,
        private activatedRoute: ActivatedRoute,
        private alertsService: AlertsService,
        private chainService: ChainService,
        private initialisationService: InitialisationService,
        private toasterService: ToasterService,
        private loginGuardService: LoginGuardService,
        private logService: LogService,
        public translate: MultilingualService,
        private changeDetectorRef: ChangeDetectorRef,
        private confirmationService: ConfirmationService,
        private loginService: LoginService,
        @Inject(APP_CONFIG) appConfig: AppConfig,
        private ofiKycService: OfiKycService,
    ) {
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
            appConfig);

    }

    getLabel(lang: string): string {
        return this.langLabels[lang];
    }

    loginedRedirect(redirect: string, urlParams: any) {
        // when login, if there is invitation token, navigate to "/mys-requests/new/"
        // this is the situation of when existing investor got invite invest on a particular access manager.
        if(urlParams.invitationToken && urlParams.amcID) {
            const queryParams = {
                invitationToken: urlParams.invitationToken,
                amcID: Number(urlParams.amcID),
            };

            this.router.navigate(['my-requests', 'new'], {queryParams});
        } else {
            this.router.navigateByUrl(redirect);
        }
    }

}
