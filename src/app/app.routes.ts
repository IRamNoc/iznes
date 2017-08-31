import {Routes} from '@angular/router';

/* Layouts. */
import {BasicLayoutComponent} from '@setl/core-layout';
import {BlankLayoutComponent} from '@setl/core-layout';

/* Components. */
import {HomeComponent} from './home/home.component';
import {SetlLoginComponent} from '@setl/core-login';
import {FormElementsComponent} from './ui-elements/form-elements.component';

/* UserAdmin Module. */
import {AdminUsersComponent} from '@setl/core-useradmin';
import {AdminWalletsComponent} from '@setl/core-useradmin';
import {AdminPermissionsComponent} from '@setl/core-useradmin';
import {AdminWizardComponent} from '@setl/core-useradmin';

/**
 * Asset serving module
 */
import {
    RegisterIssuerComponent,
    RegisterAssetComponent,
    IssueAssetComponent
} from '@setl/asset-servicing';

/**
 * Login Guard service
 */
import {LoginGuardService} from '@setl/core-login';
import {SetlMessagesComponent} from '@setl/core-messages';
import {SetlBalancesComponent, SetlIssueComponent} from '@setl/core-balances';

export const ROUTES: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'user-administration', redirectTo: 'user-administration/users', pathMatch: 'full'},
    {path: 'ui-elements', redirectTo: 'ui-elements/form', pathMatch: 'full'},

    /* Blank layout components */
    {
        path: '', component: BlankLayoutComponent,
        children: [
            {
                path: 'login', component: SetlLoginComponent,
            }
        ]
    },

    /* Basic Layout pages. */
    {
        path: '',
        component: BasicLayoutComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'messages',
                component: SetlMessagesComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'ui-elements',
                children: [
                    {
                        path: 'form',
                        component: FormElementsComponent,
                        canActivate: [LoginGuardService]
                    },
                ]
            },
            {
                path: 'reports',
                children: [
                    {
                        path: 'balances',
                        component: SetlBalancesComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'issue',
                        component: SetlIssueComponent,
                        canActivate: [LoginGuardService]
                    }
                ]
            },
            {
                path: 'asset-servicing',
                children: [
                    {
                        path: 'register-issuer',
                        component: RegisterIssuerComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'register-asset',
                        component: RegisterAssetComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'issue-asset',
                        component: IssueAssetComponent,
                        canActivate: [LoginGuardService]
                    }

                ],
                canActivate: [LoginGuardService]
            },
            {
                path: 'user-administration',
                children: [
                    {
                        path: 'users',
                        component: AdminUsersComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'wallets',
                        component: AdminWalletsComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'permissions',
                        component: AdminPermissionsComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'wizard',
                        component: AdminWizardComponent,
                        canActivate: [LoginGuardService]
                    }

                ],
                canActivate: [LoginGuardService]
            }
        ],
        canActivate: [LoginGuardService]
    }
];
