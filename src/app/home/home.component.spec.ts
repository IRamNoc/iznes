import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {NavigationSidebarComponent} from '@setl/core-layout';
import {RouterModule} from '@angular/router';
import {ROUTES} from '../app.routes';
import {BlankLayoutComponent} from '@setl/core-layout';
import {BasicLayoutComponent} from '@setl/core-layout';
import {SetlLoginComponent} from '@setl/core-login';
import {NavigationTopbarComponent} from '@setl/core-layout';
import {SetlMessagesComponent} from '@setl/core-messages';
import {SetlBalancesComponent, SetlIssueComponent} from '@setl/core-balances';
import {FormElementsComponent} from '../ui-elements/form-elements.component';
import {AdminUsersComponent} from '@setl/core-useradmin';
import {AdminWalletsComponent} from '@setl/core-useradmin';
import {AdminPermissionsComponent} from '@setl/core-useradmin';
import {AdminWalletsTableComponent} from '@setl/core-useradmin/wallets/subcomponents/wallets-table.component';
import {AdminWizardComponent} from '@setl/core-useradmin';
import {FormsModule, FormControl, NgModel, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, APP_BASE_HREF} from '@angular/common';
import {SidebarModule} from 'ng-sidebar';
import {SelectModule} from 'ng2-select';
import {ClarityModule} from 'clarity-angular';
import {RegisterIssuerComponent, RegisterAssetComponent, IssueAssetComponent} from '@setl/asset-servicing';
import {JasperoAlertsModule} from '@setl/jaspero-ng2-alerts';
import {AlertIconAndTypesService} from 'clarity-angular/emphasis/alert/providers/icon-and-types-service';
// describe('HomeComponent', () => {
//     let component: HomeComponent;
//     let fixture: ComponentFixture<HomeComponent>;
//
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 HomeComponent,
//                 NavigationSidebarComponent,
//                 NavigationSidebarComponent,
//                 NavigationTopbarComponent,
//                 BlankLayoutComponent,
//                 SetlMessagesComponent,
//                 SetlBalancesComponent,
//                 SetlLoginComponent,
//                 FormElementsComponent,
//                 AdminUsersComponent,
//                 AdminWalletsComponent,
//                 AdminPermissionsComponent,
//                 AdminWizardComponent,
//                 AdminUsersTableComponent,
//                 AdminWalletsTableComponent,
//                 AdminPermissionsTableComponent,
//                 BasicLayoutComponent,
//                 RegisterIssuerComponent,
//                 RegisterAssetComponent,
//                 IssueAssetComponent],
//             imports: [
//                 CommonModule,
//                 RouterModule.forRoot(ROUTES),
//                 SidebarModule,
//                 SelectModule,
//                 ClarityModule,
//                 FormsModule,
//                 ReactiveFormsModule,
//                 JasperoAlertsModule
//             ],
//             providers: [
//                 {provide: APP_BASE_HREF, useValue: '/'},
//                 AlertIconAndTypesService
//             ]
//         })
//             .compileComponents();
//     }));
//
//     beforeEach(() => {
//         fixture = TestBed.createComponent(HomeComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });
//
//     it('should be created', () => {
//         expect(component).toBeTruthy();
//     });
// });
