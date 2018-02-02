import {SetlLoginComponent, SetlLoginModule} from '@setl/core-login';
import {HomeComponent} from '../../../../src/app/home/home.component';
import {FormElementsComponent} from '../../../../src/app/ui-elements/form-elements.component';
import {
    AdminPermissionsComponent,
    AdminUsersComponent,
    AdminWalletsComponent,
    AdminWizardComponent
} from '@setl/core-useradmin';
import {AdminWalletsTableComponent} from '@setl/core-useradmin/wallets/subcomponents/wallets-table.component';
import {AdminPermissionsTableComponent} from '@setl/core-useradmin/permissions/subcomponents/permissions-table.component';

// describe('BlankComponent', () => {
//     let component: BlankLayoutComponent;
//     let fixture: ComponentFixture<BlankLayoutComponent>;
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
//                 AdminUsersTableComponent,
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
//         fixture = TestBed.createComponent(BlankLayoutComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });
//
//     it('should be created', () => {
//         expect(component).toBeTruthy();
//     });
// });
