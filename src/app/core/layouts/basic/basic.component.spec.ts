import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BasicLayoutComponent} from './basic.component';
import {CommonModule, APP_BASE_HREF} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SidebarModule} from 'ng-sidebar';
import {SelectModule} from 'ng2-select';
import {ClarityModule} from 'clarity-angular';
import {NavigationSidebarComponent} from '../../navigation-sidebar/navigation-sidebar.component';
import {NavigationTopbarComponent} from '../../navigation-topbar/navigation-topbar.component';
import {ROUTES} from '../../../app.routes';
import {BlankLayoutComponent} from '../../layouts/blank/blank.component';
import {SetlLoginComponent} from '@setl/core-login';
import {HomeComponent} from '../../../home/home.component';
import {SetlMessagesComponent} from '@setl/core-messages';
import {FormElementsComponent} from '../../../ui-elements/form-elements.component';
import {AdminUsersComponent} from '@setl/core-useradmin';
import {AdminWalletsComponent} from '@setl/core-useradmin';
import {AdminPermissionsComponent} from '@setl/core-useradmin';
import {AdminUsersTableComponent} from '@setl/core-useradmin/users/subcomponents/users-table.component';
import {AdminWalletsTableComponent} from '@setl/core-useradmin/wallets/subcomponents/wallets-table.component';
import {AdminPermissionsTableComponent} from '@setl/core-useradmin/permissions/subcomponents/permissions-table.component';
import {AdminWizardComponent} from '@setl/core-useradmin';
import {FormsModule, FormControl, NgModel, ReactiveFormsModule} from '@angular/forms';
import {RegisterIssuerComponent, RegisterAssetComponent, IssueAssetComponent} from '@setl/asset-servicing';
import {SetlBalancesComponent, SetlIssueComponent} from '@setl/core-balances';

describe('BasicComponent', () => {
    let component: BasicLayoutComponent;
    let fixture: ComponentFixture<BasicLayoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BasicLayoutComponent,
                NavigationSidebarComponent,
                NavigationTopbarComponent,
                BlankLayoutComponent,
                HomeComponent,
                SetlMessagesComponent,
                SetlLoginComponent,
                FormElementsComponent,
                AdminUsersComponent,
                AdminWalletsComponent,
                AdminPermissionsComponent,
                AdminWizardComponent,
                AdminUsersTableComponent,
                AdminWalletsTableComponent,
                AdminPermissionsTableComponent,
                RegisterIssuerComponent,
                RegisterAssetComponent,
                IssueAssetComponent,
                SetlBalancesComponent,
                SetlIssueComponent

            ],
            imports: [
                CommonModule,
                RouterModule.forRoot(ROUTES),
                SidebarModule,
                SelectModule,
                ClarityModule,
                FormsModule,
                ReactiveFormsModule
            ],
            providers: [
                {provide: APP_BASE_HREF, useValue: '/'}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BasicLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created!', () => {
        expect(component).toBeTruthy();
    });
});
