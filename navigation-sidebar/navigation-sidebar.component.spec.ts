// import {async, ComponentFixture, TestBed} from '@angular/core/testing';
//
// import {NavigationSidebarComponent} from './navigation-sidebar.component';
// import {RouterModule} from '@angular/router';
// import {ROUTES} from '../../../src/app/app.routes';
// import {BlankLayoutComponent} from '../layouts/blank/blank.component';
// import {BasicLayoutComponent} from '../layouts/basic/basic.component';
// import {SetlLoginComponent} from '@setl/core-login';
// import {HomeComponent} from '../../../src/app/home/home.component';
// import {NavigationTopbarComponent} from '../navigation-topbar/navigation-topbar.component';
// import {SetlMessagesComponent} from '@setl/core-messages';
// import {SetlBalancesComponent} from '@setl/core-balances';
// import {FormElementsComponent} from '../../../src/app/ui-elements/form-elements.component';
// import {AdminUsersComponent} from '@setl/core-useradmin';
// import {AdminWalletsComponent} from '@setl/core-useradmin';
// import {AdminPermissionsComponent} from '@setl/core-useradmin';
// import {AdminWalletsTableComponent} from '@setl/core-useradmin/wallets/subcomponents/wallets-table.component';
// import {AdminPermissionsTableComponent} from '@setl/core-useradmin/permissions/subcomponents/permissions-table.component';
// import {AdminWizardComponent} from '@setl/core-useradmin';
// import {FormsModule, FormControl, NgModel, ReactiveFormsModule} from '@angular/forms';
// import {CommonModule, APP_BASE_HREF} from '@angular/common';
// import {SidebarModule} from 'ng-sidebar';
// import {SelectModule} from 'ng2-select';
// import {ClarityModule} from 'clarity-angular';
// import {RegisterIssuerComponent, RegisterAssetComponent, IssueAssetComponent} from '@setl/asset-servicing';
// import {JasperoAlertsModule} from '@setl/jaspero-ng2-alerts';
// import {AlertIconAndTypesService} from 'clarity-angular/emphasis/alert/providers/icon-and-types-service';

// describe('NavigationSidebarComponent', () => {
//     let component: NavigationSidebarComponent;
//     let fixture: ComponentFixture<NavigationSidebarComponent>;
//
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 NavigationSidebarComponent,
//                 NavigationSidebarComponent,
//                 NavigationTopbarComponent,
//                 BlankLayoutComponent,
//                 HomeComponent,
//                 SetlMessagesComponent,
//                 SetlLoginComponent,
//                 SetlBalancesComponent,
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
//                 IssueAssetComponent,
//             ],
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
//         fixture = TestBed.createComponent(NavigationSidebarComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });
//
//     it('should be created', () => {
//         expect(component).toBeTruthy();
//     });
// });
