import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlankLayoutComponent} from '../blank/blank.component';
import {CommonModule, APP_BASE_HREF} from '@angular/common';
import {BasicLayoutComponent} from './basic.component';
import {RouterModule} from '@angular/router';
import {SidebarModule} from 'ng-sidebar';
import {SelectModule} from 'ng2-select';
import {ClarityModule} from 'clarity-angular';
import {NavigationSidebarComponent} from '../../navigation-sidebar/navigation-sidebar.component';
import {NavigationTopbarComponent} from '../../navigation-topbar/navigation-topbar.component';
import {ROUTES} from '../../../../src/app/app.routes';
import {SetlLoginModule, SetlLoginComponent} from '@setl/core-login';
import {HomeComponent} from '../../../../src/app/home/home.component';
import {SetlMessagesComponent} from '@setl/core-messages';
import {FormElementsComponent} from '../../../../src/app/ui-elements/form-elements.component';
import {AdminUsersComponent} from '@setl/core-useradmin';
import {AdminWalletsComponent} from '@setl/core-useradmin';
import {AdminPermissionsComponent} from '@setl/core-useradmin';
import {AdminWalletsTableComponent} from '@setl/core-useradmin/wallets/subcomponents/wallets-table.component';
import {AdminPermissionsTableComponent} from '@setl/core-useradmin/permissions/subcomponents/permissions-table.component';
import {AdminWizardComponent} from '@setl/core-useradmin';
import {FormsModule, FormControl, NgModel, ReactiveFormsModule} from '@angular/forms';
import {RegisterIssuerComponent, RegisterAssetComponent, IssueAssetComponent} from '@setl/asset-servicing';
import {SetlBalancesComponent} from '@setl/core-balances';
import {JasperoAlertsModule} from '@setl/jaspero-ng2-alerts';
import {AlertIconAndTypesService} from 'clarity-angular/emphasis/alert/providers/icon-and-types-service';
import {NgReduxModule} from '@angular-redux/store';
import {MyWalletsService} from '@setl/core-req-services';
import {MemberSocketService} from '@setl/websocket-service';
import {NgModule} from '@angular/core';

// describe('BasicComponent', () => {
//     let component: BasicLayoutComponent;
//     let fixture: ComponentFixture<BasicLayoutComponent>;
//
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 BlankLayoutComponent,
//                 BasicLayoutComponent,
//                 NavigationSidebarComponent,
//                 NavigationTopbarComponent,
//                 BlankLayoutComponent,
//                 HomeComponent,
//                 SetlMessagesComponent,
//                 SetlLoginComponent,
//                 FormElementsComponent,
//                 AdminUsersComponent,
//                 AdminWalletsComponent,
//                 AdminPermissionsComponent,
//                 AdminWizardComponent,
//                 AdminWalletsTableComponent,
//                 AdminPermissionsTableComponent,
//                 RegisterIssuerComponent,
//                 RegisterAssetComponent,
//                 IssueAssetComponent,
//                 SetlBalancesComponent
//             ],
//             imports: [
//                 CommonModule,
//                 RouterModule.forRoot(ROUTES),
//                 SidebarModule,
//                 SelectModule,
//                 ClarityModule,
//                 FormsModule,
//                 ReactiveFormsModule,
//                 JasperoAlertsModule,
//                 NgReduxModule
//             ],
//             providers: [
//                 {provide: APP_BASE_HREF, useValue: '/'},
//                 AlertIconAndTypesService,
//                 MyWalletsService,
//                 MemberSocketService
//             ]
//         })
//             .compileComponents();
//     }));
//
//     beforeEach(() => {
//         fixture = TestBed.createComponent(BasicLayoutComponent);
//         component = fixture.componentInstance;
//         console.log('------')
//         console.log(component)
//         console.log('------')
//         fixture.detectChanges();
//     });
//
//     it('should be created!', () => {
//         expect(component).toBeTruthy();
//     });
// });
