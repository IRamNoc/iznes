import {TestBed, async} from '@angular/core/testing';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, FormControl, NgModel, ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'ng2-select';
import {ClarityModule} from 'clarity-angular';
import {NgRedux, NgReduxModule} from '@angular-redux/store';
import {AppCoreModule} from './core/app-core.module';
import {AppViewsModule} from './app-views.module';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {ROUTES} from './app.routes';
import {SetlLoginModule} from '@setl/core-login';
import {LoginGuardService} from '@setl/core-login';
import {SetlMessagesModule} from '@setl/core-messages';
import {SetlBalancesModule} from '@setl/core-balances';
import {UserAdminModule} from '@setl/core-useradmin';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {MemberSocketService} from '@setl/websocket-service';
import {WalletNodeSocketService} from '@setl/websocket-service';
import {environment} from '../environments/environment';
import {MyUserService, WalletNodeRequestService} from '@setl/core-req-services';
import {AssetServicingModule} from '@setl/asset-servicing';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                HttpModule,
                FormsModule,
                ClarityModule.forRoot(),
                RouterModule.forRoot(ROUTES),
                SelectModule,
                ToasterModule,
                NgReduxModule,
                ReactiveFormsModule,
                AppCoreModule,
                AppViewsModule,
                SetlLoginModule,
                UserAdminModule,
                SetlMessagesModule,
                SetlBalancesModule,
                AssetServicingModule

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
            ]

        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

});
